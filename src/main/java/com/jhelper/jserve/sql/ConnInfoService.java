package com.jhelper.jserve.sql;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhelper.jserve.sql.entity.ConnInfo;

@Service
public class ConnInfoService {

    @Autowired
    ConnInfoRepository connInfoRepository;

    public List<ConnInfo> findAll() {
        return connInfoRepository.findAll();
    }

    public ConnInfo findById(String id) {
        return connInfoRepository.findById(id).orElse(null);
    }

    public ConnInfo save(ConnInfo connInfo) {
        return connInfoRepository.save(connInfo);
    }

    public void delete(String id) {
        connInfoRepository.deleteById(id);
    }
}
