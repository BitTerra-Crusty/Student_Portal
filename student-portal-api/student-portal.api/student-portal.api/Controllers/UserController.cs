using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
//using NETCore.MailKit.Core;
using student_portal.api.Context;
using student_portal.api.Helpers;
using student_portal.api.Models;
using student_portal.api.Models.Dto;
using student_portal.api.UtilityService;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace student_portal.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public UserController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest(new { Message = "User Not Found" });
            }

            var user = await _authContext.Users.FirstOrDefaultAsync(x=>x.Email == userObj.Email);

            if (user == null)
                return NotFound(new {Message = "User Not Found"});

            if(!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
                return BadRequest(new { Message = "Incorrect Credencials" });

            //When the User is authenticated the create a token
            user.Token = CreateJwt(user);

            return Ok(new
            {
                Token = user.Token,
                Message = "Login Successs",
                User = user
            }); ;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if(userObj == null)
                return BadRequest();
            if(string.IsNullOrEmpty(userObj.Email))
                return BadRequest();

            //Check username
            if(await CheckUsernameExist(userObj.Email))
                return BadRequest(new {Message = "Email Already Exists"});


            //Check password strength

            var pass = CheckPasswordStrength(userObj.Password);
                if(!string.IsNullOrEmpty(pass))
                    return BadRequest(new {Message = pass.ToString()});

            userObj.Role = "User";
            userObj.Token = string.Empty;

            userObj.Password = PasswordHasher.HashPassword(userObj.Password);


            await _authContext.Users.AddAsync(userObj);

            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Message = " User Registred",
                User = userObj
            });
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            if (string.IsNullOrEmpty(userObj.Email))
                return BadRequest();

            //Check username
            var user = await _authContext.Users.AnyAsync(x => x.Email == userObj.Email); 

            if(user == null) 
                return BadRequest();
            else
            {
                _authContext.Entry(userObj).State = EntityState.Modified;

                try
                {
                    await _authContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (user == null)
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }

        }

        private Task<bool> CheckUsernameExist(string email)
        {
            return _authContext.Users.AnyAsync(x => x.Email == email); ;
        }

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();

            if(password.Length < 8)
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be Alphanumeric" + Environment.NewLine);
            if(!Regex.IsMatch(password, "[<,>,@,!,|,!,*,&,%,$,#,(,),-,+,_,\\,//,;,',,?]"))
                sb.Append("password should contain special characters and at least a number"+ Environment.NewLine);
            return sb.ToString();
        }

        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler(); //Declare the Security handler object
            var key = Encoding.ASCII.GetBytes("badbadbadsecret....."); //Create the key

            //Create Payload
            var identity = new ClaimsIdentity(new Claim[]
            {

                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),

            } );

            //Create the credentials
            var credencials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            //Createthe token descripter
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddMinutes(5), //Expires in 5 minutes
                SigningCredentials = credencials,
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);//this is our token

            return jwtTokenHandler.WriteToken(token);//create the string like token
        }

        [Authorize]
        [HttpGet("Users")]
        public async Task<ActionResult> GetAllUsers()
        {

            return Ok(await _authContext.Users.ToListAsync());
        }

        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user =await _authContext.Users.FirstOrDefaultAsync(a => a.Email == email);

            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email Doesn't Exist"
                });
            }

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPassdwordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(20);
            string from = _configuration["EmailSettings:From"];

           
            try
            {
               var emailModel = new EmailModel(email, "Reset Password", EmailBody.EmailStringBody(email, emailToken));


                _emailService.SendEmail(emailModel);

                _authContext.Entry(user).State = EntityState.Modified;

                await _authContext.SaveChangesAsync();

                return Ok(new
                {
                    status = 200,
                    Message = "=Email Sent"
                });
            }
            catch (Exception ex)
            {

            }
            return Ok();


            
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Email == resetPasswordDto.Email);

            if(user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Doesn't Exist"
                });
            }

            var tokenCode = user.ResetPassdwordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if(tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset link"
                });
            }

            user.Password = PasswordHasher.HashPassword(resetPasswordDto.NewPassword);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfully"
            });
        }
    }
}
