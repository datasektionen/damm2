import React, { useContext, useState } from 'react';
import { IPatch, ITag } from '../../../../types/definitions';
import Moment from 'react-moment';
import { PatchImage, Left, Right, Description, Tags, Meta, CloseButton, Content, Files, Creators, Thrash, H1, Storage, StorageItem, StorageItems } from './style';
import { Button } from '../../../../components/Button/Button';
import { Tag } from '../../../../components/Tag/Tag';
import { url } from '../../../../common/api';
import { AdminContext } from '../../../../App';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Props {
    patch: IPatch;
    onClose: () => void;
    onEditClick: () => void;
    fetchPatches: () => void;
    type: "patch" | "artefact";
}

export const DetailsView: React.FC<Props> = ({ patch, onEditClick, onClose, fetchPatches, type }) => {
    const { admin } = useContext(AdminContext)
    const isAdmin = admin.includes("admin") || admin.includes("prylis");

    const [loading, setLoading] = useState(false);

    const deleteFile = (name: string) => {
        setLoading(true)
        axios.delete(url(`/api/files/file/?name=${encodeURIComponent(name)}&id=${patch.id}&type=${type}`), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(async res => {
            await fetchPatches();
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            <Left>
                <a href={patch.images[0]} target="_blank" rel="noopener noreferrer" title="Öppna i ny flik">
                    <PatchImage src={patch.images[0] ?? ""} draggable={false} />
                </a>
                {isAdmin && <Button label="Redigera" onClick={onEditClick} disabled={loading} />}
                {isAdmin && type === "patch" && patch.files && patch.files.length !== 0 &&
                    <Files>
                        <h4>Filer</h4>
                        {patch.files.map((f: string) => {
                            const completeUrl = url(`/api/files/get/${encodeURIComponent(f)}?token=${localStorage.getItem("token")}`)
                            return (
                                <div key={"patch-file-" + f}>
                                    <a target="_blank" rel="noopener noreferrer" href={completeUrl}>{f}</a>
                                    <Thrash onClick={() => {
                                        if (loading) return;
                                        if (window.confirm("Är du säker? Filen tas bort permanent från AWS S3.")) deleteFile(f)
                                    }}>
                                        <i className="fas fa-trash" />
                                    </Thrash>
                                </div>
                            );
                        })}
                    </Files>
                }
                {type === "artefact" && patch.files.length !== 0 &&
                    <Files>
                        <h4>Filer</h4>
                        {patch.files.map((f: string) => {
                            const completeUrl = url(`/api/files/get/unprotected/${encodeURIComponent(f)}`)
                            return (
                                <div key={"patch-file-" + f}>
                                    <a target="_blank" rel="noopener noreferrer" href={completeUrl}>{f}</a>
                                    {isAdmin &&
                                        <Thrash onClick={() => {
                                            if (loading) return;
                                            if (window.confirm("Är du säker? Filen tas bort permanent från AWS S3.")) deleteFile(f)
                                        }}>
                                            <i className="fas fa-trash" />
                                        </Thrash>
                                    }
                                </div>
                            );
                        })}
                    </Files>
                }
            </Left>
            <Right>
                <H1>{patch.name}</H1>
                <Meta>
                    <span title="Id">
                        <i className="fas fa-fingerprint"></i>
                        {patch.id}
                    </span>
                    <span title="Datum">
                        <i className="far fa-clock" />
                        {patch.date.length === 0 ?
                            "Okänt"
                            :
                            <Moment format="Do MMMM YYYY" locale="sv">
                                {patch.date}
                            </Moment>
                        }
                    </span>
                    <span title="Uppladdningsdatum">
                        <i className="fas fa-cloud-upload-alt" />
                        <Moment format="Do MMMM YYYY" locale="sv">
                            {patch.createdAt}
                        </Moment>
                    </span>
                    <span title="Senast redigerad">
                        <i className="fas fa-edit"></i>
                        <Moment format="Do MMMM YYYY HH:mm:ss" locale="sv">
                            {patch.updatedAt}
                        </Moment>
                    </span>
                    {patch.creators.length !== 0 &&
                        <div>
                            Skapad av: <Creators>{patch.creators.join(", ")}</Creators>
                        </div>
                    }
                </Meta>
                <Content>
                    <Description>
                        <ReactMarkdown linkTarget="_blank">
                            {patch.description === "" ? "Ingen beskrivning finns" : patch.description}
                        </ReactMarkdown>
                    </Description>
                    <Tags>
                        {patch.tags.length === 0 && "Märket har inga taggar"}
                        {patch.tags.map((t: ITag, i: number) =>
                            <Tag {...t} key={"patch-detailed-" + i + "-" + t.id} />
                        )}
                    </Tags>
                </Content>
                {isAdmin &&
                    <Storage>
                        <StorageItems>
                            <StorageItem title="Låda">
                                <i className="fa-solid fa-box"></i>
                                <span>
                                    {patch.bag?.box.name ?? "?"}
                                </span>
                            </StorageItem>
                            <StorageItem title="Påse">
                                <i className="fa-solid fa-bag-shopping"></i>
                                <span>
                                    {patch.bag?.name ?? "?"}
                                </span>
                            </StorageItem>
                        </StorageItems>
                    </Storage>
                }
            </Right>
            <CloseButton onClick={onClose} title="Stäng">
                <i className="fas fa-times" />
            </CloseButton>
        </>
    )
}