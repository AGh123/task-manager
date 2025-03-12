using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace task_manager.Models
{
    public class TaskItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Column(TypeName = "CLOB")] 
        public string Description { get; set; }

        [Column(TypeName = "NUMBER(1)")]
        public bool IsCompleted { get; set; } = false;

        [ForeignKey("AssignedToEmployee")]
        public int AssignedToEmployeeId { get; set; }

        public Employee AssignedToEmployee { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedAt { get; set; }
    }
}
