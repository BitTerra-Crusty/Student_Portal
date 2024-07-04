using student_portal.api.Models;

namespace student_portal.api.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
