package br.edu.utfpr.pb.pw44s.server.service.impl;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class AddressServiceImpl extends CrudServiceImpl<Address, Long> implements IAddressService {
    private final AddressRepository addressRepository;
    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }
    @Override
    protected AddressRepository getRepository() {
        return addressRepository;
    }
    @Override
    @Transactional(readOnly = true)
    public List<Address> findAll() {
        return addressRepository.findAllWithUser();
    }
    @Override
    public List<Address> findByUserId(Long userId) {
        return addressRepository.findByUserIdWithUser(userId);
    }
}