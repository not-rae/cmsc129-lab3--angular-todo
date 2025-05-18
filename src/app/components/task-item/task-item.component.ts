import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../Task';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})

export class TaskItemComponent {
  @Input() task!: Task;
  @Output() onDeleteTask = new EventEmitter<Task>();
  @Output() onEditTask = new EventEmitter<Task>();
  @Output() onToggleDone = new EventEmitter<{ task: Task; done: boolean }>();

  faTimes = faTimes;
  faEdit = faEdit;

  onDelete() {
    this.onDeleteTask.emit(this.task);
  }

  onEdit() {
    this.onEditTask.emit(this.task);
  }

  toggleDoneFromEvent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onToggleDone.emit({ task: this.task, done: input.checked });
  }
}
