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
                                <i className="fa-solid fa-vest-patches"></i>
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
                <p>Välkommen till Damm - Konglig Datasektionens historiesystem.</p>
                <p>
                    Detta system sammanställer sektionens historia på tre sätt: märkesarkivet, tidslinjen och museet.
                </p>
                <p>Damm hanteras av sektionshistorikern, vänd dig till hen om du har några frågor eller vill bidra med historia: <a href="mailto:historiker@datasektionen.se" target="_blank" rel="noopener noreferrer">historiker@datasektionen.se</a></p>
                <h3>Märkesarkivet</h3>
                <p>Märkesarkivet arkiverar märken som skapats inom sektionen genom tiderna. Här finner du allt från årskursmärket 1991 till fidgetspinnermärken från 2017. Arkivet består egentligen av ett fysiskt arkiv och ett digitalt arkiv. I det fysiska arkivet sparas märken för att sedan fotograferas och läggas upp i Damm. Damm, det digitala arkivet, är ett sätt för sektionsmedlemmar att lätt få tillgång till märkesarkivet. Arkivet är beroende av att funktionärer, projekt och evenemang sparar ett exemplar av varje märke som skapas och donerar till arkivet.</p>
                <h3>Tidslinjen</h3>
                <p>Tidslinjen visar viktiga historiska händelser som skett i sektionen sedan dess grundande den 7 oktober 1983.</p>
                <h3>Museum</h3>
                <p>Museet är tänkt att visa upp "artefakter" och viktiga föremål som tillhör sektionen.</p>
                <h2>Hittat en bugg? Vill du bidra?</h2>
                <p>
                    Damm finns på <a href="https://github.com/datasektionen/damm2" target="_blank" rel="noopener noreferrer">GitHub</a>
                </p>
                <h2>Damms historia</h2>
                <p>Jonas Dahl skrev tidslinjen under 2017. Axel Elmarsson skrev sedan resterande systemet 2020 och 2021.</p>
            </div>
        </StyledLanding>
    )
}