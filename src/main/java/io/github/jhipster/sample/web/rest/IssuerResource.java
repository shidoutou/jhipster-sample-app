package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.domain.Issuer;
import io.github.jhipster.sample.repository.IssuerRepository;
import io.github.jhipster.sample.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link io.github.jhipster.sample.domain.Issuer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IssuerResource {

    private final Logger log = LoggerFactory.getLogger(IssuerResource.class);

    private static final String ENTITY_NAME = "issuer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IssuerRepository issuerRepository;

    public IssuerResource(IssuerRepository issuerRepository) {
        this.issuerRepository = issuerRepository;
    }

    /**
     * {@code POST  /issuers} : Create a new issuer.
     *
     * @param issuer the issuer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new issuer, or with status {@code 400 (Bad Request)} if the issuer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/issuers")
    public ResponseEntity<Issuer> createIssuer(@RequestBody Issuer issuer) throws URISyntaxException {
        log.debug("REST request to save Issuer : {}", issuer);
        if (issuer.getId() != null) {
            throw new BadRequestAlertException("A new issuer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Issuer result = issuerRepository.save(issuer);
        return ResponseEntity
            .created(new URI("/api/issuers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /issuers/:id} : Updates an existing issuer.
     *
     * @param id the id of the issuer to save.
     * @param issuer the issuer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated issuer,
     * or with status {@code 400 (Bad Request)} if the issuer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the issuer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/issuers/{id}")
    public ResponseEntity<Issuer> updateIssuer(@PathVariable(value = "id", required = false) final String id, @RequestBody Issuer issuer)
        throws URISyntaxException {
        log.debug("REST request to update Issuer : {}, {}", id, issuer);
        if (issuer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, issuer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!issuerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        issuer.setIsPersisted();
        Issuer result = issuerRepository.save(issuer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, issuer.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /issuers/:id} : Partial updates given fields of an existing issuer, field will ignore if it is null
     *
     * @param id the id of the issuer to save.
     * @param issuer the issuer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated issuer,
     * or with status {@code 400 (Bad Request)} if the issuer is not valid,
     * or with status {@code 404 (Not Found)} if the issuer is not found,
     * or with status {@code 500 (Internal Server Error)} if the issuer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/issuers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Issuer> partialUpdateIssuer(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Issuer issuer
    ) throws URISyntaxException {
        log.debug("REST request to partial update Issuer partially : {}, {}", id, issuer);
        if (issuer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, issuer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!issuerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Issuer> result = issuerRepository
            .findById(issuer.getId())
            .map(existingIssuer -> {
                if (issuer.getName() != null) {
                    existingIssuer.setName(issuer.getName());
                }

                return existingIssuer;
            })
            .map(issuerRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, issuer.getId()));
    }

    /**
     * {@code GET  /issuers} : get all the issuers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of issuers in body.
     */
    @GetMapping("/issuers")
    public List<Issuer> getAllIssuers() {
        log.debug("REST request to get all Issuers");
        return issuerRepository.findAll();
    }

    /**
     * {@code GET  /issuers/:id} : get the "id" issuer.
     *
     * @param id the id of the issuer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the issuer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/issuers/{id}")
    public ResponseEntity<Issuer> getIssuer(@PathVariable String id) {
        log.debug("REST request to get Issuer : {}", id);
        Optional<Issuer> issuer = issuerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(issuer);
    }

    /**
     * {@code DELETE  /issuers/:id} : delete the "id" issuer.
     *
     * @param id the id of the issuer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/issuers/{id}")
    public ResponseEntity<Void> deleteIssuer(@PathVariable String id) {
        log.debug("REST request to delete Issuer : {}", id);
        issuerRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
