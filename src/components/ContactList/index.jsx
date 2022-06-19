import { faCheckCircle, faEllipsisV, faHeart, faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, CustomInput, Row } from "reactstrap";

import styles from "./style.module.css";

const contactinfo = [{
    name: "Alex timba",
    number: "1236549870",
    address: "21,hazubuzu view, singapore maliasulu 1602598",
    default: true
}, {
    name: "Alex hunuman",
    number: "9685730254",
    address: "21,hazubuzu view, singapore maliasulu 1602598",
    default: false
}
]

const ContactList = props => {
    const { activeLetter } = props;
    return (
        <>
            <p className={[styles.contactHeading].join(" ")}>{activeLetter ? activeLetter : "Favourite"}</p>
            {
                contactinfo?.length && contactinfo?.length > 0 ? contactinfo.map((data, idx) => (
                    <div className={[styles.contactWrapper, "mb-3"].join(" ")}>
                        <Row className={[styles.aliging].join(" ")}>
                            <Col xs={2} sm={2} md={1} lg={1} xl={1} className="pr-0">
                                <CustomInput
                                    type="checkbox"
                                    id={`${data.name.split(" ")[0]}${idx + 1}`}
                                    name="isFavourite"
                                    value={true}
                                />
                            </Col>
                            <Col xs={9} sm={9} md={8} lg={8} xl={8} className="pl-0">
                                <Row className={[styles.aliging].join(" ")}>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={3} className={"mb-2 mb-md-0"}>
                                        <p className={[styles.contactName].join(" ")}><span>AB</span>{data.name}</p>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={3} className={"mb-2 mb-md-0"}>
                                        <div className={[styles.contactNumber].join(" ")}>
                                            <FontAwesomeIcon size="1x" icon={faPhoneAlt} color="#2d3436" /><span>{data.number}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={6} className={"mb-2 mb-md-0"}>
                                        <div className={[styles.address].join(" ")}>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" color={"#2d3436"} />
                                            <span>{data.address}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1} sm={1} md={3} lg={3} xl={3} className={[styles.posRel].join(" ")}>
                                <div className={[styles.posAbs].join(" ")} >
                                    {
                                        data.default && (
                                            <p className={[styles.defaultContact].join(" ")}>
                                                <span>
                                                    <FontAwesomeIcon
                                                        size="1x"
                                                        color="#00E493"
                                                        icon={faCheckCircle}
                                                    />
                                                </span>
                                                default
                                            </p>
                                        )
                                    }
                                    <div className={[styles.fav].join(" ")}>
                                        <span>
                                            <FontAwesomeIcon
                                                size="1x"
                                                color="red"
                                                icon={faHeart}
                                            />
                                        </span>
                                        <FontAwesomeIcon
                                            size="1x"
                                            color="##2d3436"
                                            icon={faEllipsisV}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                )) :
                    (
                        <p>fuck off</p>
                    )

            }
        </>
    )
}

export default ContactList;