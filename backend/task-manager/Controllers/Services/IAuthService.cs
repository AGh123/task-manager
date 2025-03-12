using task_manager.Models;

namespace task_manager.Controllers.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(Employee employee);
    }
}
