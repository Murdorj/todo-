package com.example.demo.controller;

import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoRepository repo;
    private final TodoRepository todoRepository;

    public TodoController(TodoRepository repo, TodoRepository todoRepository) {
        this.repo = repo;
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return repo.save(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updated) {
        Optional<Todo> existing = todoRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        Todo todo = existing.get();
        todo.setTitle(updated.getTitle());
        todo.setCompleted(updated.isCompleted());
        todo.setDueDate(updated.getDueDate());
        return ResponseEntity.ok(todo);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.delete(id);
    }
}
