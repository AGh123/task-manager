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

        // 🔹 Only Managers can get all employees
        [HttpGet]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAllEmployees()
        {
            return Ok(await _employeeService.GetAllEmployeesAsync());
        }

        // 🔹 Employees can only get their own data
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

        // 🔹 Only Managers can create employees
        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            // 🔹 Hash the password before saving
            employee.PasswordHash = PasswordHasher.Hash(employee.PasswordHash);
            var createdEmployee = await _employeeService.CreateEmployeeAsync(employee);
            return CreatedAtAction(nameof(GetEmployeeById), new { id = createdEmployee.Id }, createdEmployee);
        }

        // 🔹 Only Managers can update employees
        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            // 🔹 Hash the password before updating
            updatedEmployee.PasswordHash = PasswordHasher.Hash(updatedEmployee.PasswordHash);

            var result = await _employeeService.UpdateEmployeeAsync(id, updatedEmployee);
            if (result == null) return NotFound(new { message = "Employee not found" });

            return Ok(result);
        }

        // 🔹 Only Managers can delete employees
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
