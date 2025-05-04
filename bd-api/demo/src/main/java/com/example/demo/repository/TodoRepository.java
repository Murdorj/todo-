package com.example.demo.repository;

import com.example.demo.model.Todo;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public class TodoRepository {
    private final Map<Long, Todo> store = new HashMap<>();
    private long id = 1;

    public List<Todo> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<Todo> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Todo save(Todo todo) {
        todo.setId(id++);
        todo.setCreatedAt(LocalDateTime.now());
        store.put(todo.getId(), todo);
        return todo;
    }

    public void delete(Long id) {
        store.remove(id);
    }

    public Optional<Todo> update(Long id, Todo updated) {
        if (!store.containsKey(id)) return Optional.empty();

        Todo existing = store.get(id);
        existing.setTitle(updated.getTitle());
        existing.setCompleted(updated.isCompleted());
        existing.setDueDate(updated.getDueDate());

        store.put(id, existing);
        return Optional.of(existing);
    }
}
