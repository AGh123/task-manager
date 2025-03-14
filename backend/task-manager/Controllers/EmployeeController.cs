using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using task_manager.Models;
using task_manager.Services;
using task_manager.Helpers;
using System.Security.Claims;

namespace task_manager.Controllers
{
    [Route("api/employees")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAllEmployees()
        {
            return Ok(await _employeeService.GetAllEmployeesAsync());
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isManager = User.IsInRole("Manager");

            if (!isManager && id != userId)
                return Forbid();

            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound(new { message = "Employee not found" });

            return Ok(employee);
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            if (await _employeeService.EmployeeExistsAsync(employee.Email))
                return BadRequest("Email already exists.");

            var newEmployee = new Employee
            {
                FullName = employee.FullName,
                Email = employee.Email,
                PasswordHash = PasswordHasher.Hash(employee.PasswordHash),
                IsManager = false,
                CreatedAt = DateTime.UtcNow
            };

            var createdEmployee = await _employeeService.CreateEmployeeAsync(newEmployee);
            return CreatedAtAction(nameof(GetEmployeeById), new { id = createdEmployee.Id }, createdEmployee);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            updatedEmployee.PasswordHash = PasswordHasher.Hash(updatedEmployee.PasswordHash);

            var result = await _employeeService.UpdateEmployeeAsync(id, updatedEmployee);
            if (result == null) return NotFound(new { message = "Employee not found" });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            bool isDeleted = await _employeeService.DeleteEmployeeAsync(id);
            if (!isDeleted) return NotFound(new { message = "Employee not found" });

            return NoContent();
        }
    }
}
