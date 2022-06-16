import { Link, Outlet, useLocation } from "react-router-dom";
import { Header } from "methone";
import { ROUTES } from "../../common/routes";
import { useContext } from "react";
import { AdminContext } from "../../App";

const linkToTitle = {
    "/admin/create-patch": "Skapa märke",
    "/admin/manage-tags": "Hantera taggar",
    "/admin/manage-events": "Hantera händelser",
    "/admin/create-artefact": "Skapa artefakt"
}

export const Admin = () => {

    const { admin } = useContext(AdminContext);
    const location = useLocation();

    const patchLinks = admin.includes("admin") || admin.includes("prylis");
    const timelineLinks = admin.includes("admin") || admin.includes("post");
    const artefactLinks = admin.includes("admin");

    return (
        <>
            <Header title={linkToTitle[location.pathname] ?? "Administrera"} />
            <div id="content" style={{ display: "flex" }}>
                <div style={{ width: "25%", padding: "0 15px" }}>
                    {patchLinks &&
                        <div id="secondary-nav">
                            <h3>Märkesarkiv</h3>
                            <ul>
                                <li>
                                    <Link to={ROUTES.PATCH_CREATOR}>Skapa märke</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.TAGS_MANAGER}>Hantera taggar</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.STORAGE}>Hantera förvaring</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PATCH_ARCHIVE}>Lista märken</Link>
                                </li>
                            </ul>
                        </div>
                    }
                    {timelineLinks &&
                        <div id="secondary-nav">
                            <h3>Tidslinje</h3>
                            <ul>
                                <li>
                                    <Link to={ROUTES.EVENT_HANDLER}>Hantera händelser</Link>
                                </li>
                            </ul>
                        </div>
                    }
                    {/* {artefactLinks &&
                        <div id="secondary-nav">
                            <h3>Artefakter</h3>
                            <ul>
                                <li>
                                    <Link to={ROUTES.ARTEFACT_CREATOR}>Skapa artefakter</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.TAGS_MANAGER}>Hantera taggar</Link>
                                </li>
                            </ul>
                        </div>
                    } */}
                </div>
                <div style={{ width: "75%", "padding": "0 15px" }}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}
