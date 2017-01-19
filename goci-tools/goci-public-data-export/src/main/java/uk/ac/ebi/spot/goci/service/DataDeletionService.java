package uk.ac.ebi.spot.goci.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.ac.ebi.spot.goci.model.Ancestry;
import uk.ac.ebi.spot.goci.model.Association;
import uk.ac.ebi.spot.goci.model.Locus;
import uk.ac.ebi.spot.goci.model.RiskAllele;
import uk.ac.ebi.spot.goci.model.Study;
import uk.ac.ebi.spot.goci.repository.AncestryRepository;
import uk.ac.ebi.spot.goci.repository.AssociationRepository;
import uk.ac.ebi.spot.goci.repository.LocusRepository;
import uk.ac.ebi.spot.goci.repository.RiskAlleleRepository;
import uk.ac.ebi.spot.goci.repository.StudyRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by dwelter on 09/01/17.
 */

@Service
public class DataDeletionService {

    private final Logger log = LoggerFactory.getLogger(getClass());

    protected Logger getLog() {
        return log;
    }

    private StudyService studyService;
    private AncestryRepository ancestryRepository;
    private StudyRepository studyRepository;
    private AssociationRepository associationRepository;
    private LocusRepository locusRepository;
    private RiskAlleleRepository riskAlleleRepository;

    @Autowired
    public DataDeletionService(StudyService studyService,
                               StudyRepository studyRepository,
                               AncestryRepository ancestryRepository,
                               AssociationRepository associationRepository,
                               LocusRepository locusRepository,
                               RiskAlleleRepository riskAlleleRepository){
        this.studyService = studyService;
        this.studyRepository = studyRepository;
        this.ancestryRepository = ancestryRepository;
        this.associationRepository = associationRepository;
        this.locusRepository = locusRepository;
        this.riskAlleleRepository = riskAlleleRepository;
    }

    public void deleteNonPublicStudies(){

        List<Study> unpublishedStudies = studyService.deepFindUnPublishedStudies();

        getLog().info("Found " + unpublishedStudies.size() + " unpublished studies to be removed");


        unpublishedStudies.forEach(this::deleteStudy);
    }

    private void deleteStudy(Study study) {
        System.out.println("Removing study \t" + study.getAuthor() + "\t (ID:" + study.getId() + ")");

        getLog().debug("Removing study \t" + study.getAuthor() + "\t (ID:" + study.getId() + ")");

        Collection<Association> associations = study.getAssociations();

        getLog().debug("Removing \t" + associations.size() + "\t associations");

        System.out.println("Removing \t" + associations.size() + "\t associations");

        associations.forEach(this::deleteAssociation);

        Collection<Ancestry> ancestries = study.getAncestries();

        getLog().debug("Removing \t" + ancestries.size() + "\t sample descriptions");
        System.out.println("Removing \t" + ancestries.size() + "\t sample descriptions");


        ancestries.forEach(
                ancestry -> ancestryRepository.delete(ancestry)
        );

        studyRepository.delete(study);
    }


    private void deleteAssociation(Association association) {

        Collection<RiskAllele> riskAlleles = new ArrayList<>();
        for (Locus locus : association.getLoci()) {
            getLog().debug("Removing locus number\t" + locus.getId());
            System.out.println("Removing locus number\t" + locus.getId());

            locus.getStrongestRiskAlleles().forEach(riskAlleles::add);
            locusRepository.delete(locus);
        }
        getLog().debug("Removing\t" + riskAlleles.size() + " risk alleles");
        System.out.println("Removing\t" + riskAlleles.size() + " risk alleles");

        riskAlleles.forEach(riskAllele -> riskAlleleRepository.delete(riskAllele));

        getLog().debug("Removing association \t" + association.getId());
        System.out.println("Removing association \t" + association.getId());

        associationRepository.delete(association);
    }
}
