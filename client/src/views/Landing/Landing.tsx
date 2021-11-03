import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../common/routes";
import {
    StyledLanding,
    Pick,
    Alternative,
    Icon,
    Desc,
    Alternatives,
} from "./style";

export const Landing: React.FC = (props) => {
    return (
        <StyledLanding>
            <Pick>
                <Alternatives>
                    <Alternative>
                        <Link to={ROUTES.PATCH_ARCHIVE}>
                            <Icon>
                            <i className="fas fa-archive"></i>
                                {/* <i className="fas fa-trophy" /> */}
                            </Icon>
                            <Desc>
                                Märkesarkiv
                            </Desc>
                        </Link>
                    </Alternative>
                    <Alternative>
                        <Link to={ROUTES.TIMELINE}>
                            <Icon>
                            <i className="fas fa-history"></i>
                                {/* <i className="fas fa-trophy" /> */}
                            </Icon>
                            <Desc>
                                Tidslinje
                            </Desc>
                        </Link>
                    </Alternative>
                    <Alternative>
                        <Link to={ROUTES.MUSEUM}>
                            <Icon>
                            <i className="fas fa-trophy"></i>
                                {/* <i className="fas fa-trophy" /> */}
                            </Icon>
                            <Desc>
                                Museum
                            </Desc>
                        </Link>
                    </Alternative>
                </Alternatives>
            </Pick>
            <div id="content" style={{minHeight: 0}}>
                <h2>Damm</h2>
                <p>Löksås ipsum ta är samtidigt så vidsträckt denna rännil plats, samma färdväg strand söka i där gör. Sig hans dimma strand dock sällan tid åker hans, enligt lax tiden kom smultron åker dock dag vad, göras mjuka där annan redan för hwila. Därmed ser sjö dag brunsås träutensilierna har bra, det att redan det oss och mjuka inom, ska nu år tidigare hav så.</p>
                <h3>Märkesarkivet</h3>
                <p>Löksås ipsum ta är samtidigt så vidsträckt denna rännil plats</p>
                <h3>Museum</h3>
                <p>Löksås ipsum ta är samtidigt så vidsträckt denna rännil plats</p>
                <h3>Tidslinjen</h3>
                <p>Löksås ipsum ta är samtidigt så vidsträckt denna rännil plats</p>
            </div>
        </StyledLanding>
    )
}