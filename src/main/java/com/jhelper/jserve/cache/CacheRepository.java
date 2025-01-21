package com.jhelper.jserve.cache;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jhelper.jserve.cache.entity.Cache;

@Repository
public interface CacheRepository extends JpaRepository<Cache, String> {

}
