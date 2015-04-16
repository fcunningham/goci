package db.migration;

import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by emma on 16/04/2015.
 *
 * @author emma
 *         <p>
 *         Written to ensure risk alleles are not shared between locus. For each association a new locus will be created
 *         and for each locus new risk alleles are created, they are never reused.
 */
public class V1_9_9_037__Risk_alllele_locus_links implements SpringJdbcMigration {

    private static final String SELECT_DATA_FOR_UPDATE = "SELECT DISTINCT r.RISK_ALlELE_NAME, r.RISK_ALlELE, " +
            "r.LOCUS_ID, r.SINGLE_NUCLEOTIDE_POLYMORPHISM " +
            "FROM (\n" +
            "SELECT  l.id as LOCUS_ID, ra.ID AS RISK_ALLELE, snp.id as SINGLE_NUCLEOTIDE_POLYMORPHISM , " +
            "ra.risk_allele_name as RISK_ALLELE_NAME FROM RISK_ALLELE ra\n" +
            "JOIN LOCUS_RISK_ALLELE lra ON lra.RISK_ALLELE_ID = ra.ID\n" +
            "JOIN LOCUS l ON l.ID = lra.LOCUS_ID\n" +
            "join  RISK_ALLELE_SNP ras on ras.RISK_ALLELE_ID=ra.id\n" +
            "JOIN SINGLE_NUCLEOTIDE_POLYMORPHISM snp on snp.id = ras.SNP_ID )r\n" +
            "JOIN (\n" +
            "SELECT RISK_ALLELE, COUNT(LOCUS) AS LOCUS_COUNT FROM (\n" +
            "SELECT ra.ID AS RISK_ALLELE, l.id as LOCUS\n" +
            "FROM RISK_ALLELE ra\n" +
            "JOIN LOCUS_RISK_ALLELE lra ON lra.RISK_ALLELE_ID = ra.ID\n" +
            "JOIN LOCUS l ON l.ID = lra.LOCUS_ID)\n" +
            "GROUP BY RISK_ALLELE) " +
            "f ON f.RISK_ALLELE = r.RISK_ALLELE\n" +
            "WHERE f.LOCUS_COUNT > 1\n" +
            "ORDER BY r.RISK_ALLELE";

    private static final String UPDATE_LOCUS_RISK_ALLELE =
            "UPDATE LOCUS_RISK_ALLELE SET RISK_ALLELE_ID = ? WHERE LOCUS_ID = ? AND RISK_ALLELE_ID = ?";

    public void migrate(JdbcTemplate jdbcTemplate) throws Exception {

        // Maps to store relevant information
        final Map<Long, String> riskAlleleIdIdToRiskAlleleName = new HashMap<>();
        final Map<Long, Long> riskAlleleIdIdToSnpId = new HashMap<>();
        final Map<Long, Set<Long>> riskAlleleIdIdToLociIds = new HashMap<>();

        jdbcTemplate.query(SELECT_DATA_FOR_UPDATE, (RowMapper<Object>) (resultSet, i) -> {
            String riskAlleleName = resultSet.getString(0);
            long riskAlleleId = resultSet.getLong(1);
            long locusId = resultSet.getLong(2);
            long snpId = resultSet.getLong(3);

            riskAlleleIdIdToRiskAlleleName.put(riskAlleleId, riskAlleleName);
            riskAlleleIdIdToSnpId.put(riskAlleleId, snpId);

            // Create map of risk allele to linked loci
            if (riskAlleleIdIdToLociIds.containsKey(riskAlleleId)) {
                riskAlleleIdIdToLociIds.get(riskAlleleId).add(locusId);
            }

            // First time we see a risk allele don't store the locus ID
            // as this locus will keep the old risk allele id linked
            // to it
            else {
                riskAlleleIdIdToLociIds.put(riskAlleleId, new HashSet<>());
            }
            return null;

        });

        // Insert statements
        SimpleJdbcInsert insertRiskAllele =
                new SimpleJdbcInsert(jdbcTemplate)
                        .withTableName("RISK_ALLELE")
                        .usingColumns("RISK_ALLELE_NAME")
                        .usingGeneratedKeyColumns("ID");

        SimpleJdbcInsert insertRiskAlleleSnp =
                new SimpleJdbcInsert(jdbcTemplate)
                        .withTableName("RISK_ALLELE_SNP")
                        .usingColumns("RISK_ALLELE_ID", "SNP_ID");

        // For each locus create a new risk allele with same name and link to same snp as old id
        for (long oldRiskAlleleId : riskAlleleIdIdToLociIds.keySet()) {
            Set<Long> lociIds = riskAlleleIdIdToLociIds.get(oldRiskAlleleId);

            // For each locus
            for (long locusId : lociIds) {

                // Get the risk allele name using the old ID
                String riskAlleleName = riskAlleleIdIdToRiskAlleleName.get(oldRiskAlleleId);

                //Create new allele
                Map<String, Object> riskAlleleArgs = new HashMap<>();
                riskAlleleArgs.put("RISK_ALLELE_NAME", riskAlleleName);
                Number riskAlleleID = insertRiskAllele.executeAndReturnKey(riskAlleleArgs);

                // Update LOCUS_RISK_ALLELE table
                jdbcTemplate.update(UPDATE_LOCUS_RISK_ALLELE,
                                    riskAlleleID,
                                    locusId,
                                    oldRiskAlleleId);

                // Insert new risk allele details into RISK_ALLELE_SNP
                long snpId = riskAlleleIdIdToSnpId.get(oldRiskAlleleId);
                try {
                    Map<String, Object> riskAlleleSnpArgs = new HashMap<>();
                    riskAlleleSnpArgs.put("RISK_ALLELE_ID", riskAlleleID.longValue());
                    riskAlleleSnpArgs.put("SNP_ID", snpId);
                    insertRiskAlleleSnp.execute(riskAlleleSnpArgs);
                }
                catch (DataIntegrityViolationException e) {
                    throw new RuntimeException(
                            "Failed to insert link between risk allele = " + riskAlleleID + " and snp  = " + snpId,
                            e);
                }
            }

        }
    }
}
