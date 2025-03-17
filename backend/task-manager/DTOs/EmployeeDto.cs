namespace task_manager.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool IsManager { get; set; }
        public IEnumerable<TaskItemDto> Tasks { get; set; } = new List<TaskItemDto>();
    }
}
