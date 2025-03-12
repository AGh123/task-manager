using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using task_manager.Models;
using task_manager.Services;
using System.Security.Claims;

namespace task_manager.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class TaskItemController : ControllerBase
    {
        private readonly ITaskItemService _taskService;

        public TaskItemController(ITaskItemService taskService)
        {
            _taskService = taskService;
        }

        // 🔹 Employees see their own tasks, Managers see all
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllTasks()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isManager = User.IsInRole("Manager");

            if (isManager)
            {
                return Ok(await _taskService.GetAllTasksAsync());
            }
            else
            {
                return Ok(await _taskService.GetTasksByEmployeeIdAsync(userId));
            }
        }

        // 🔹 Get task by ID (Only the assigned employee or manager can access it)
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isManager = User.IsInRole("Manager");

            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound(new { message = "Task not found" });

            if (!isManager && task.AssignedToEmployeeId != userId)
                return Forbid();

            return Ok(task);
        }

        // 🔹 Create a new task (Only Managers can create tasks)
        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            var createdTask = await _taskService.CreateTaskAsync(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.Id }, createdTask);
        }

        // 🔹 Update a task (Only Managers can update tasks)
        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var result = await _taskService.UpdateTaskAsync(id, updatedTask);
            if (result == null)
                return NotFound(new { message = "Task not found" });

            return Ok(result);
        }

        // 🔹 Employees can mark their assigned tasks as completed
        [HttpPut("{id}/complete")]
        [Authorize]
        public async Task<IActionResult> MarkTaskAsCompleted(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            if (task.AssignedToEmployeeId != userId)
                return Forbid();

            task.IsCompleted = true;
            await _taskService.UpdateTaskAsync(id, task);

            return Ok(new { message = "Task marked as completed" });
        }

        // 🔹 Delete a task (Only Managers can delete tasks)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            bool isDeleted = await _taskService.DeleteTaskAsync(id);
            if (!isDeleted)
                return NotFound(new { message = "Task not found" });

            return NoContent();
        }
    }
}
