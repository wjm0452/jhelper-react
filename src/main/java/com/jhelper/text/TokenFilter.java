package com.jhelper.text;

@FunctionalInterface
public interface TokenFilter {
    public boolean match(String token);
}
