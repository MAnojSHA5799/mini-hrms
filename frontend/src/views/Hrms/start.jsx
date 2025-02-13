import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Form, Image } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import homelogo from  "assets/img/hrms/Picture4.png";
import bgImage from "assets/img/hrms/bg1copy.jpg";

function Start() {
  const navigate = useNavigate();
  const backgroundImageStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh'
  };
  return (
    <Container fluid className="bttn vh-100 loginPage" style={backgroundImageStyle}>
      
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="heading text-white">HRMS</h1>
        <p className="sub-heading text-white">
          Human Resource <br />
          Management <br />
          System
        </p>
      </div>

      <Row className="justify-content-center align-items-center">
        <Col md={5} className="p-4 text-center">
          <Form>
            <Row className="mb-3">
              <Col>
                <Button className="bttun"
                  size="md"
                  onClick={() => navigate("/auth/sign-in")}
                  style={{
                    width: "150px",
                    height: "50px",
                    marginTop: "110px",
                    backgroundColor: "#E55A1B",
                    outline: "none",
                    border: "none",
                  }}
                >
                  HRMS
                </Button>
              </Col>
              {/* <Col>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/accounts")}
                >
                  Accounts
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/learning")}
                >
                  LMS
                </Button>
              </Col> */}
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Footer */}
      <footer className="footer">
        <Container fluid>
          {/* <Row>
            <Col>
              <p className="text-white">
                Blitz Learning Technologies Information Management System
                <br />
                Developed by Blitz Learning Technologies Pvt. Ltd.
              </p>
            </Col>
            <Col className="text-right">
              <Image src={homelogo} alt="Logo" />
            </Col>
          </Row> */}
        </Container>
      </footer>
    </Container>
  );
}

export default Start;
