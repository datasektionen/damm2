import { Link, Outlet, useLocation } from "react-router-dom";
import { Header } from "methone";
import { ROUTES } from "../../common/routes";
import { useAppContext } from "../../hooks/useAppContext";

const linkToTitle = {
    "/admin/create-patch": "Skapa märke",
    "/admin/manage-tags": "Hantera taggar",
    "/admin/manage-events": "Hantera händelser",
    "/admin/create-artefact": "Skapa artefakt",
    "/admin/patch-list": "Lista märken",
    "/admin/manage-boxes": "Hantera lådor",
    "/admin/manage-bags": "Hantera påsar",
    "/admin/persons": "Hantera personer",
    "/admin/export-patches": "Exportera data",
}

export const Admin = () => {

    const { admin } = useAppContext();
    const location = useLocation();

    const patchLinks = admin.includes("admin") || admin.includes("prylis");
    const timelineLinks = admin.includes("admin") || admin.includes("post");
    const adminLinks = admin.includes("admin");

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
                                    <Link to={ROUTES.MANAGE_BOXES}>Hantera lådor</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.MANAGE_BAGS}>Hantera påsar</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PATCH_LIST}>Lista märken</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.PERSON_MANAGER}>Hantera personer</Link>
                                </li>
                                <li>
                                    <Link to={ROUTES.EXPORT_PATCHES}>Exportera data</Link>
                                </li>
                            </ul>
                        </div>
                    }
                    {timelineLinks && (
                        <div id="secondary-nav">
                            <h3>Tidslinje</h3>
                            <ul>
                                <li>
                                    <Link to={ROUTES.EVENT_HANDLER}>Hantera händelser</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    {adminLinks && (
                        <div id="secondary-nav">
                            <h3>Mörkläggning</h3>
                            <ul>
                                <li>
                                    <Link to={ROUTES.DARK_MODE}>Hantera mörkläggning</Link>
                                </li>
                            </ul>
                        </div>
                    )}
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
                <div style={{ width: "75%", "padding": "0 15px", position: "relative" }}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}
