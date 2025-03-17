using Microsoft.EntityFrameworkCore;
using task_manager.Data;
using task_manager.DTOs;
using task_manager.Models;

namespace task_manager.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly TaskManagerDbContext _context;

        public EmployeeService(TaskManagerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _context.Employees
                .Include(e => e.Tasks)
                .ToListAsync();
            return employees.Select(e => new EmployeeDto
            {
                Id = e.Id,
                FullName = e.FullName,
                Email = e.Email,
                IsManager = e.IsManager,
                Tasks = e.Tasks.Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted
                })
            });
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Tasks)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null) return null;

            return new EmployeeDto
            {
                Id = employee.Id,
                FullName = employee.FullName,
                Email = employee.Email,
                IsManager = employee.IsManager,
                Tasks = employee.Tasks.Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted
                }).ToList()
            };
        }

        public async Task<Employee> CreateEmployeeAsync(Employee employee)
        {
            var existingEmail = await _context.Employees.CountAsync(e => e.Email == employee.Email) > 0;
            if (existingEmail) return null;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<Employee?> UpdateEmployeeAsync(int id, Employee updatedEmployee)
        {
            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null) return null;

            existingEmployee.FullName = updatedEmployee.FullName;
            existingEmployee.Email = updatedEmployee.Email;
            existingEmployee.PasswordHash = updatedEmployee.PasswordHash;
            existingEmployee.IsManager = updatedEmployee.IsManager;

            await _context.SaveChangesAsync();
            return existingEmployee;
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
