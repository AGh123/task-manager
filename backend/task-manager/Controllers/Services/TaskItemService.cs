using Microsoft.EntityFrameworkCore;
using task_manager.Data;
using task_manager.DTOs;
using task_manager.Models;

namespace task_manager.Services
{
    public class TaskItemService : ITaskItemService
    {
        private readonly TaskManagerDbContext _context;

        public TaskItemService(TaskManagerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItemDto>> GetAllTasksAsync()
        {
            var tasks = await _context.Tasks.ToListAsync();
            return tasks.Select(t => new TaskItemDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                AssignedToEmployeeId = t.AssignedToEmployeeId
            });
        }

        public async Task<IEnumerable<TaskItemDto>> GetTasksByEmployeeIdAsync(int employeeId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.AssignedToEmployeeId == employeeId)
                .ToListAsync();

            return tasks.Select(t => new TaskItemDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                AssignedToEmployeeId = t.AssignedToEmployeeId
            });
        }

        public async Task<TaskItemDto?> GetTaskByIdAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null) return null;

            return new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                AssignedToEmployeeId = task.AssignedToEmployeeId
            };
        }

        public async Task<TaskItem?> GetTaskModelByIdAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null) return null;

            return task;
        }


        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return null;

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.IsCompleted = updatedTask.IsCompleted;

            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
