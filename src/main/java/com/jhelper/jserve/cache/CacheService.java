package com.jhelper.jserve.cache;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.cache.entity.Cache;

@Service
public class CacheService {

    @Autowired
    CacheRepository cacheRepository;

    public List<Cache> findAll() {
        return cacheRepository.findAll();
    }

    public Cache findById(String id) {
        return cacheRepository.findById(id).orElse(null);
    }

    public Cache save(Cache cache) {
        return cacheRepository.save(cache);
    }

    public void delete(String id) {
        cacheRepository.deleteById(id);
    }
}
