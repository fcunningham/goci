-- GWASCOUNTRIES
INSERT INTO GWASCOUNTRIES (MAJORAREA, REGION, COUNTRY) VALUES ('Latin America and the Caribbean','Central America','Mexico');
INSERT INTO GWASCOUNTRIES (MAJORAREA, REGION, COUNTRY) VALUES ('Europe','Southern Europe','Spain');
INSERT INTO GWASCOUNTRIES (MAJORAREA, REGION, COUNTRY) VALUES ('Asia','Eastern Asia','Japan');
INSERT INTO GWASCOUNTRIES (MAJORAREA, REGION, COUNTRY) VALUES ('Asia','Eastern Asia','China');
INSERT INTO GWASCOUNTRIES (MAJORAREA, REGION, COUNTRY) VALUES ('Asia','South-eastern Asia','Thailand');

-- GWASGENE
INSERT INTO GWASGENE (ID, GENE) VALUES (11986,'OXER1');
INSERT INTO GWASGENE (ID, GENE) VALUES (12187,'TBX3');
INSERT INTO GWASGENE (ID, GENE) VALUES (12036,'PPM1F');

-- GWASETHNICITY
INSERT INTO GWASETHNICITY (GWASID, TYPE, NUMINDIVIDUALS, ETHNICGROUP, COUNTRYORIGIN, COUNTRYRECRUITMENT, ADDLDESCRIPTION, PREVIOUSLYREPORTED, SAMPLESIZESMATCH, NOTES) VALUES ('1', 'replication', 1413, 'South East Asian', 'NULL', 'Thailand', 'Bangkok, Thailand', 'NULL', 'Y', 'NULL');
INSERT INTO GWASETHNICITY (GWASID, TYPE, NUMINDIVIDUALS, ETHNICGROUP, COUNTRYORIGIN, COUNTRYRECRUITMENT, ADDLDESCRIPTION, PREVIOUSLYREPORTED, SAMPLESIZESMATCH, NOTES) VALUES ('1', 'initial', 1772, 'East Asian', 'NULL', 'China', 'Hefei, Anhui Province, China; Hong Kong, China;', 'NULL', 'Y', 'NULL');
INSERT INTO GWASETHNICITY (GWASID, TYPE, NUMINDIVIDUALS, ETHNICGROUP, COUNTRYORIGIN, COUNTRYRECRUITMENT, ADDLDESCRIPTION, PREVIOUSLYREPORTED, SAMPLESIZESMATCH, NOTES) VALUES ('1', 'replication', 4071, 'East Asian', 'NULL', 'China', 'Anhui, China; Hong Kong, China;', 'NULL', 'Y', 'NULL');
INSERT INTO GWASETHNICITY (GWASID, TYPE, NUMINDIVIDUALS, ETHNICGROUP, COUNTRYORIGIN, COUNTRYRECRUITMENT, ADDLDESCRIPTION, PREVIOUSLYREPORTED, SAMPLESIZESMATCH, NOTES) VALUES ('2', 'initial', 2566, 'European', 'NULL', 'U.S.', 'Cambridge, MA; Nashville, TN; Seattle, WA; San Francisco, CA; Philadelphia, PA', 'NR', 'Y', 'Sample size in table S1; description in methods');
INSERT INTO GWASETHNICITY (GWASID, TYPE, NUMINDIVIDUALS, ETHNICGROUP, COUNTRYORIGIN, COUNTRYRECRUITMENT, ADDLDESCRIPTION, PREVIOUSLYREPORTED, SAMPLESIZESMATCH, NOTES) VALUES ('2', 'replication', 495, 'European', 'NULL', 'U.S.', 'Cambridge, MA; Philadelphia, PA; Nashville, TN; Seattle, WA; San Francisco, CA', 'NR', 'Y', 'Sample size in table S1; description in methods');

-- GWASREGION
INSERT INTO GWASREGION (ID, REGION) VALUES (42234, '13q14.11');

-- GWASSNP
INSERT INTO GWASSNP (ID, SNP, CHROMOSOME_NAME, CHROMOSOME_POS, LASTUPDATEDATE) VALUES (16780, 'rs7329174', '19', '6546489897', '2010-05-27 14:27:19');

-- GWASEFOTRAITS
INSERT INTO GWASEFOTRAITS (EFOTRAIT, EFOURI) VALUES ('systemic lupus erythematosus', 'http://www.ebi.ac.uk/efo/EFO_0002690');
INSERT INTO GWASEFOTRAITS (EFOTRAIT, EFOURI) VALUES ('acute lung injury', 'http://www.ebi.ac.uk/efo/EFO_0004610');

-- GWASCURATORS
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Joannella','Morales', 'jmorales@ebi.ac.uk','moralesj2');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Jackie','MacArthur','jalm@ebi.ac.uk','macarthurja');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Lucia','Hindorff','hindorffl@mail.nih.gov','hindorffl');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Heather','Junkins','junkinsh@mail.nih.gov','junkinsh');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Peggy','Hall','Peggy.Hall@nih.gov','kwongp');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Dani','Welter','dwelter@ebi.ac.uk','welterd');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Shaila','Chhibba','shaila.chhibba@nih.gov','chhibbas');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('Emily', 'Bowler', 'NULL', 'NULL');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('NULL', 'Unassigned', 'NULL', 'NULL');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('NULL', 'GWAS Catalog', 'NULL', 'NULL');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('NULL', 'Level 2 Curator', 'NULL', 'NULL');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('NULL', 'Level 1 Curator', 'NULL', 'NULL');
INSERT INTO GWASCURATORS (FIRSTNAME, LASTNAME, EMAIL, USERNAME) VALUES ('NULL', 'Level 1 Ethnicity Curator', 'NULL', 'NULL');

-- GWASSTATUS
INSERT INTO GWASSTATUS (STATUS, SEQNBR) VALUES ('Awaiting Curation','0');
INSERT INTO GWASSTATUS (STATUS, SEQNBR) VALUES ('Level 1 curation done','2');
INSERT INTO GWASSTATUS (STATUS, SEQNBR) VALUES ('Level 2 curation done','4');
INSERT INTO GWASSTATUS (STATUS, SEQNBR) VALUES ('Send to NCBI',	'5');
INSERT INTO GWASSTATUS (STATUS, SEQNBR) VALUES ('Publish study','6');
INSERT INTO GWASSTATUS (STATUS, SEQNBR) VALUES ('Outstanding Query','11');


-- GWASDISEASETRAITS
INSERT INTO GWASDISEASETRAITS (DISEASETRAIT) VALUES ('Systemic lupus erythematosus');
INSERT INTO GWASDISEASETRAITS (DISEASETRAIT) VALUES ('Acute lung injury');

-- HOUSEKEEPING
INSERT INTO HOUSEKEEPING (STUDYSNPCHECKEDL1, STUDYSNPCHECKEDL2, PUBLISHDATE, NOTES, ETHNICITYCHECKEDL1, ETHNICITYCHECKEDL2, SENDTONCBIDATE, CHECKEDNCBIERROR, FILENAM, CURATORID, CURATORSTATUSID, ETHNICITYBACKFILLED, STUDYADDEDDATE, LASTUPDATEDATE) VALUES ( '1', '1', '2011-01-03 15:19:20', 'Here are some notes about this study', '1', '1', NULL,'0','/nfs/gwas/Yang.21044949.2010.pdf', 1 , 2 ,'1' ,'2011-01-03 00:00:00','2014-06-09 08:17:40' );
INSERT INTO HOUSEKEEPING ( STUDYSNPCHECKEDL1, STUDYSNPCHECKEDL2, PUBLISHDATE, NOTES, ETHNICITYCHECKEDL1, ETHNICITYCHECKEDL2, SENDTONCBIDATE, CHECKEDNCBIERROR, FILENAM, CURATORID, CURATORSTATUSID, ETHNICITYBACKFILLED,  STUDYADDEDDATE, LASTUPDATEDATE) VALUES ('1', '1', '2012-01-03 15:19:20', 'No combine or meta-analysis result to report no significant Pvalue from any study, PH', '1', '1', NULL,'0','Christie.Acute lung injury.PLoS One.2012.pdf',2 , 3 ,'1' ,'2011-01-03 00:00:00','2014-06-09 08:17:40' );


-- GWASSTUDIES
INSERT INTO GWASSTUDIES (AUTHOR, STUDYDATE, PUBLICATION, TITLE, INITSAMPLESIZE, REPLICSAMPLESIZE, PLATFORM, PMID, CNV, GXE, GXG, DISEASEID, HOUSEKEEPINGID)
VALUES ('Yang J','2010-11-02 00:00:00', 'Hum Mol Genet','ELF1 is associated with systemic lupus erythematosus in Asian populations','612 Chinese ancestry cases, 1,160 Chinese ancestry controls','2,090 Chinese ancestry cases, 1,981 Chinese ancestry controls, 462 Thai ancestry cases, 951 Thai ancestry controls','Illumina [513,108]', '21044949', '1', '0', '1', 1,1);
INSERT INTO GWASSTUDIES (AUTHOR, STUDYDATE, PUBLICATION, TITLE, INITSAMPLESIZE, REPLICSAMPLESIZE, PLATFORM, PMID, CNV, GXE, GXG, DISEASEID, HOUSEKEEPINGID)
VALUES ('Christie JD','2012-01-25 00:00:00', 'PLoS Onet','Genome wide association identifies PPFIA1 as a candidate gene for acute lung injury risk following major trauma','600 European ancestry cases, 2,266 European ancestry controls','212 European ancestry cases, 283 European ancestry controls','Illumina [2,487,415] (imputed)', '22295056', '0', '0', '0', 2,2);

-- GWASASSOCIATIONS
INSERT INTO GWASASSOCIATIONS (ID, STUDYID, STRONGESTALLELE, RISKFREQUENCY, ALLELE, PVALUEFLOAT, PVALUETXT, ORPERCOPYNUM, ORTYPE, SNPTYPE, PVALUE_MANTISSA, PVALUE_EXPONENT, ORPERCOPYRECIP, ORPERCOPYSTDERROR, ORPERCOPYRANGE, ORPERCOPYUNITDESCR) VALUES (16617, '1', 'rs7329174-G', '0.22', 'G', 1E-8, 'NULL', 1.26, '1','Novel', 1, -8, null, null,'[1.16-1.36]', 'NULL');
INSERT INTO GWASASSOCIATIONS (ID, STUDYID, STRONGESTALLELE, RISKFREQUENCY, ALLELE, PVALUEFLOAT, PVALUETXT, ORPERCOPYNUM, ORTYPE, SNPTYPE, PVALUE_MANTISSA, PVALUE_EXPONENT, ORPERCOPYRECIP, ORPERCOPYSTDERROR, ORPERCOPYRANGE, ORPERCOPYUNITDESCR) VALUES (16618, '2', 'rs7329174-G', '0.22', 'G', 1E-8, 'NULL', 1.26, '1','Novel', 1, -8, null, null,'[1.16-1.36]', 'NULL');

-- GWASEFOSTUDYXREF
INSERT INTO GWASEFOSTUDYXREF (TRAITID, STUDYID) VALUES (1,1);
INSERT INTO GWASEFOSTUDYXREF (TRAITID, STUDYID) VALUES (2,2);

-- GWASREGIONXREF
INSERT INTO GWASREGIONXREF (ID, REGIONID, GWASSNPID) VALUES (4304061,42234,16780);

-- GWASGENEXREF
INSERT INTO GWASGENEXREF (ID, GENEID, GWASSNPID) VALUES (4304061,11986,16780);
INSERT INTO GWASGENEXREF (ID, GENEID, GWASSNPID) VALUES (4304062,12187,16780);
INSERT INTO GWASGENEXREF (ID, GENEID, GWASSNPID) VALUES (4304063,12036,16780);

-- GWASSNPXREF
INSERT INTO GWASSNPXREF (ID, SNPID, GWASSTUDIESSNPID) VALUES (20631, 16780,16617);
INSERT INTO GWASSNPXREF (ID, SNPID, GWASSTUDIESSNPID) VALUES (20631, 16780,16618);




