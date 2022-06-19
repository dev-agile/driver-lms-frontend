import React from "react";
import { faLongArrowAltLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Row } from "reactstrap";
import ContactList from "../../components/ContactList";

import styles from "./style.module.css";


const letterArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

const RecipientList = props => {
    return (
        <Container>
            <Row className="align-items-center mt-2 mt-md-5 ">
                <Col xs={12} sm={12} md={1} className="text-md-center pr-0">
                    <FontAwesomeIcon
                        size="2x"
                        color="#718093"
                        icon={faLongArrowAltLeft}
                        className="point"
                    />
                </Col>
                <Col xs={12} sm={12} md={11} className="pl-md-0">
                    <p className={[styles.Header, "m-0"].join(" ")}>
                        To whom do you want to deliver?
                    </p>
                </Col>
            </Row>
            <Row className="justify-content-between">
                <Col xs={12} md={7} className="mt-3">
                    <div class={styles.searchContainer}>
                        <form action="">
                            <button type="submit"><FontAwesomeIcon
                                size="1x"
                                color="#CDD1CF"
                                icon={faSearch}
                                className="point"
                            /></button>
                            <input type="text" placeholder="Search" name="search" />
                        </form>
                    </div>
                </Col>
                <Col xs={12} md={3} className="mt-3">
                    <Button className={[styles.addBtn, "float-right"].join(" ")}> + Add New </Button>
                </Col>
            </Row>
            <Row>
                <Col className="mt-3">
                    <div className={[styles.contactList, " py-3 px-md-3  "].join(" ")}>
                        <ContactList />
                        <div className={[styles.letterWrapper, "my-5"].join(" ")}>
                            {
                                letterArray.map((data, index) => <span className={index === 0 && styles.activeLetter} key={`${index + 1}${data}`}>{data}</span>)
                            }
                        </div>
                        <ContactList activeLetter={"A"} />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default RecipientList;