import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Task } from '../../Task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnChanges {
  @Input() task?: Task;
  @Output() onSaveTask: EventEmitter<Task> = new EventEmitter();
  @Output() onCancelForm: EventEmitter<void> = new EventEmitter();

  text: string = '';
  dueDate: string = '';
  dueTime: string = '';
  priority: 'High' | 'Mid' | 'Low' | '' = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.text = this.task.text;
      this.priority = this.task.priority ?? '';
      if (this.task.day) {
        const [date, time] = this.task.day.split(' ');
        this.dueDate = date || '';
        this.dueTime = time || '';
      }
    } else {
      this.text = '';
      this.dueDate = '';
      this.dueTime = '';
      this.priority = '';
    }
  }

  onSubmit() {
    if (!this.text) {
      alert('Please add a task!');
      return;
    }

    const combinedDay = `${this.dueDate} ${this.dueTime}`.trim();

    const taskToSave: Task = {
      id: this.task?.id,
      text: this.text,
      day: combinedDay,
      done: this.task?.done ?? false,
      priority: this.priority
    };

    this.onSaveTask.emit(taskToSave);

    this.text = '';
    this.dueDate = '';
    this.dueTime = '';
    this.priority = 'Low';
  }

  onCancel() {
    this.onCancelForm.emit();
  }
}
