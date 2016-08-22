/*
################################################################################
Create table that displays all deleted association events, version 41 worked but forgot to update
name in version 42 thus table was overwritten

author: Emma Hastings
date:    Aug 22th 2016
version: 2.1.2.044
################################################################################
*/
--------------------------------------------------------
-- Update view with correct name
--------------------------------------------------------

CREATE OR REPLACE VIEW DELETED_ASSOCIATION_EVENTS_VIEW (
        ID,
        STUDY_ID,
        ASSOCIATION_ID,
        EVENT_DATE,
        EVENT_TYPE,
        EVENT_DESCRIPTION,
        EVENT_USER)
    AS SELECT ROWNUM, V.* FROM
        (SELECT DA.STUDY_ID AS STUDY_ID, DA.ID AS ASSOCIATION_ID , E.EVENT_DATE, E.EVENT_TYPE, E.EVENT_DESCRIPTION, SU.EMAIL AS EVENT_USER
         FROM  DELETED_ASSOCIATION_EVENT DAE , SECURE_USER SU , DELETED_ASSOCIATION DA, EVENT E
         WHERE DA.ID = DAE.DELETED_ASSOCIATION_ID
               AND E.ID = DAE.EVENT_ID
               AND SU.ID = E.USER_ID
         ORDER BY DA.STUDY_ID DESC) V
