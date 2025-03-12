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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (await _context.Employees.AnyAsync(e => e.Email == model.Email))
                return BadRequest(new { message = "Email already exists" });

            var employee = new Employee
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = PasswordHasher.Hash(model.Password),
                IsManager = false
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _context.Employees.SingleOrDefaultAsync(e => e.Email == model.Email);
            if (user == null || !PasswordHasher.Verify(model.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials" });

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }
    }
}
