using task_manager.DTOs;
using task_manager.Models;

namespace task_manager.Services
{
    public interface ITaskItemService
    {
        Task<IEnumerable<TaskItemDto>> GetAllTasksAsync();
        Task<IEnumerable<TaskItemDto>> GetTasksByEmployeeIdAsync(int employeeId);
        Task<TaskItemDto?> GetTaskByIdAsync(int id);
        Task<TaskItem?> GetTaskModelByIdAsync(int id);
        Task<TaskItem> CreateTaskAsync(TaskItem task);
        Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask);
        Task<bool> DeleteTaskAsync(int id);
    }
}
