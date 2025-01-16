package com.jhelper.jserve.web.entity;

import org.hibernate.annotations.Comment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "connInfo")
@Comment(value = "연결 정보")
@NoArgsConstructor
public class ConnInfo {

    @Id
    @Column(name = "name")
    @Comment(value = "name")
    private String name;

    @Column(name = "vendor")
    @Comment(value = "vendor")
    private String vendor;

    @Column(name = "jdbc_url")
    @Comment(value = "jdbcUrl")
    private String jdbcUrl;

    @Column(name = "driver_class_name")
    @Comment(value = "driverClassName")
    private String driverClassName;

    @Column(name = "username")
    @Comment(value = "username")
    private String username;

    @Column(name = "password")
    @Comment(value = "password")
    private String password;

}
