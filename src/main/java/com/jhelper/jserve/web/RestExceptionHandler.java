package com.jhelper.jserve.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.jhelper.jserve.common.ProgramErrorDto;
import com.jhelper.jserve.common.ProgramException;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(ProgramException.class)
    protected ResponseEntity<ProgramErrorDto> handleProgramException(ProgramException e) {
        ProgramErrorDto errorDto = new ProgramErrorDto(e.getState(), e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDto);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ProgramErrorDto> handleException(Exception e) {
        ProgramErrorDto errorDto = new ProgramErrorDto("ERROR", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDto);
    }
}
