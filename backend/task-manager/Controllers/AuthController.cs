using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using task_manager.Controllers.Services;
using task_manager.Data;
using task_manager.Models;
using task_manager.Helpers;

namespace task_manager.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TaskManagerDbContext _context;
        private readonly IAuthService _authService;

        public AuthController(TaskManagerDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _context.Employees.SingleOrDefaultAsync(e => e.Email == model.Email);
            if (user == null || !PasswordHasher.Verify(model.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials" });

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }

    }
}
