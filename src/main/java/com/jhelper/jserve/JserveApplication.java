package com.jhelper.jserve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.jhelper" })
public class JserveApplication {

	public static void main(String[] args) {
		SpringApplication.run(JserveApplication.class, args);
	}
}
