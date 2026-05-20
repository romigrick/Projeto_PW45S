package br.edu.utfpr.pb.pw44s.server.repository;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
    @Query("SELECT a FROM Address a LEFT JOIN FETCH a.user")
    List<Address> findAllWithUser();
    @Query("SELECT a FROM Address a LEFT JOIN FETCH a.user WHERE a.user.id = :userId")
    List<Address> findByUserIdWithUser(@Param("userId") Long userId);
}