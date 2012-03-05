package uk.ac.ebi.fgpt.goci.pussycat.renderlet.chromosome;

import java.net.URL;

/**
 * Created by IntelliJ IDEA.
 * User: dwelter
 * Date: 01/03/12
 * Time: 10:46
 * To change this template use File | Settings | File Templates.
 */
public class ChrSixteen extends ChromosomeRenderlet{

    @Override
    protected URL getSVGFile() {
        return getClass().getClassLoader().getResource("chromosomes/16.svg");

    }

    public String getName() {
        return "Chromosome 16";
    }
}
