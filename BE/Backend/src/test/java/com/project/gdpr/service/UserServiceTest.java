package com.project.gdpr.service;

import com.project.gdpr.dto.UserDto;
import com.project.gdpr.dto.UserRegistrationDto;
import com.project.gdpr.entity.User;
import com.project.gdpr.entity.UserRole;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.UserAlreadyExistsException;
import com.project.gdpr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPasswordHash("encodedPassword");
        user.setRole(UserRole.VIEWER);
    }

    @Test
    void testCreateUser_Success() {
        UserRegistrationDto registrationDto = new UserRegistrationDto();
        registrationDto.setEmail("new@example.com");
        registrationDto.setUsername("newuser");
        registrationDto.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = userService.createUser(registrationDto);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
    }
}