package uk.ac.ebi.spot.goci.curation.service;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by emma on 19/03/15.
 *
 * @author emma
 *         <p>
 *         Service class to deal with NCBI ftp interactions Code is based on this extremely helpful example:
 *         http://www.codejava.net/java-se/networking/ftp/java-ftp-file-upload-tutorial-and-example
 */
@Service
public class FtpFileService {

    // Reading these from application.properties
    @Value("${ftp.server}")
    private String server;

    @Value("${ftp.username}")
    private String userName;

    @Value("${ftp.password}")
    private String password;

    private FTPClient ftpClient;

    private final Logger log = LoggerFactory.getLogger(getClass());

    protected Logger getLog() {
        return log;
    }

    // Constructor
    public FtpFileService() {
        this.ftpClient = new FTPClient();
    }

    // Upload file to NCBI
    public void ftpFileUpload(File outputFile) throws IOException {

        // Connect to FTP
        connect();

        InputStream inputStream = new FileInputStream(outputFile);
        String remoteFile = "gwas.txt";

        boolean done = ftpClient.storeFile(remoteFile, inputStream);
        inputStream.close();
        if (done) {
            getLog().info(remoteFile + " uploaded successfully.");
        }

        else {
            getLog().error("Failed to upload file " + remoteFile + " to FTP");
        }


        // Close FTP connection
        disconnect();
    }

    // Connect to FTP server
    public void connect() throws IOException {

        // Connect to server
        int reply;
        try {
            ftpClient.connect(server);
            getLog().info("Connecting to " + server);

            ftpClient.login(userName, password);
            ftpClient.enterLocalPassiveMode();

            reply = ftpClient.getReplyCode();

            if (!FTPReply.isPositiveCompletion(reply)) {
                ftpClient.disconnect();
                getLog().error("FTP server refused connection");
                System.exit(1);
            }

        }
        catch (IOException e) {
            throw new RuntimeException(
                    "Unable to connect to FTP ", e);
        }
    }


    // Disconnect from FTP server
    public void disconnect() {
        try {
            if (ftpClient.isConnected()) {
                ftpClient.logout();
                ftpClient.disconnect();
            }
        }
        catch (IOException e) {
            throw new RuntimeException(
                    "Unable to disconnect from FTP ", e);
        }
    }
}
