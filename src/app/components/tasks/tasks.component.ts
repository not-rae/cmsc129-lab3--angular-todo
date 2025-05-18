import { Component, OnInit } from '@angular/core';
import { Task } from '../../Task';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskItemComponent, CommonModule, AddTaskComponent, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  taskToEdit?: Task;
  showAddTaskForm: boolean = false;

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  deleteTask(task: Task) {
    const confirmed = confirm(`Are you sure you want to delete the task?`);
    if (!confirmed) return;

    const deletedTask = task;

    this.tasks = this.tasks.filter((t) => t.id !== task.id);

    this.taskService.deleteTask(task).subscribe();

    const snackBarRef = this.snackBar.open('Task deleted', 'Undo', {
      duration: 5000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.taskService.addTask(deletedTask).subscribe((restoredTask) => {
        this.tasks.push(restoredTask);
      });
    });

    if (this.taskToEdit?.id === task.id) {
      this.taskToEdit = undefined;
      this.showAddTaskForm = false;
    }
  }


  addOrUpdateTask(task: Task) {
    if (task.id) {
      this.taskService.updateTask(task).subscribe((updatedTask) => {
        this.tasks = this.tasks.map((t) => t.id === updatedTask.id ? updatedTask : t);
        this.taskToEdit = undefined;
        this.sortTasks(); 
      });
    } else {
      task.createdAt = new Date().toISOString(); 
      this.taskService.addTask(task).subscribe((newTask) => {
        this.tasks.push(newTask);
        this.sortTasks();
      });
    }
  }

  editTask(task: Task) {
    this.taskToEdit = task;
    this.showAddTaskForm = true;
  }

  addTask() {
    this.taskToEdit = undefined;
    this.showAddTaskForm = true;
  }

  onFormClose() {
    this.showAddTaskForm = false;
    this.taskToEdit = undefined;
  }

  handleToggleDone({ task, done }: { task: Task; done: boolean }) {
    task.done = done;
    this.taskService.updateTask(task).subscribe((updatedTask) => {
      this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    });
  }

  markTaskAsDone({ task, done }: { task: Task; done: boolean }) {
    task.done = done;
    this.addOrUpdateTask(task);
  }

  sortBy: string = 'createdAt';

  sortTasks() {
    this.tasks.sort((a, b) => {
      if (this.sortBy === 'createdAt') {
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      } else if (this.sortBy === 'day') {
        return new Date(a.day).getTime() - new Date(b.day).getTime();
      } else if (this.sortBy === 'priority') {
        const priorityOrder = { High: 1, Mid: 2, Low: 3 };
        return (priorityOrder[a.priority || 'Low'] - priorityOrder[b.priority || 'Low']);
      }
      return 0;
    });
  }
}
