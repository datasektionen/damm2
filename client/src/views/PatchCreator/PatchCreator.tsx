import React, { useEffect, useMemo, useState } from 'react';
import {
  H3,
  H4,
  Content,
  StyledPatchCreator,
  BRow,
  StyledRequired,
  ImagePreview,
  Row,
} from './style';
import { Field } from '../../components/Field/Field';
import { TextArea } from '../../components/TextArea/TextArea';
import http from '../../common/api';
import { url } from '../../common/api';
import { FormChangeEvent, IPerson, ITag } from '../../types/definitions';
import { Button } from '../../components/Button/Button';
import { FileUploader } from '../../components/FileUploader/FileUploader';
import { TagSelector } from '../../components/TagSelector/TagSelector';
import { CreatorHandler } from '../../components/CreatorHandler/CreatorHandler';
import { Alert } from '../../components/Alert/Alert';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import { uploadFiles } from '../../functions/fileUploading';
import { useTitle } from '../../hooks/useTitle';
import { title } from '../../common/strings';

const Required: React.FC = () => <StyledRequired>*</StyledRequired>;

interface Form {
  name: string;
  description: string;
  date: string;
  tags: ITag[];
  creators: string[];
  amount: string;
}

const defaultForm: Form = {
  name: '',
  description: '',
  date: '',
  tags: [],
  creators: [],
  amount: '0',
};

export const PatchCreator: React.FC = () => {
  useTitle(title('Skapa märke'));

  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [form, setForm] = useState<Form>(defaultForm);
  const [persons, setPersons] = useState<IPerson[]>([]);
  const [creators, setCreators] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await http.get<{ body: ITag[] }>(
        url('/api/tags/all?type=PATCH')
      );
      if (result.status === 200) {
        setAllTags(result.data.body);
        setLoading(false);
      }
      // TODO Handle error
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await http.get<{ body: IPerson[] }>(
        url('/api/persons/all')
      );
      if (result.status === 200) {
        setPersons(result.data.body);
      }
    })();
  }, []);

  const onChange = (e: FormChangeEvent) => {
    const name = e.target.name;
    const value = e.target.value;

    setForm({ ...form, [name]: value });
  };

  const onAddImage = (image: File) => {
    setImage(image);
  };

  const onClearImage = () => {
    setImage(null);
  };

  const scrollTop = () => window.scrollTo({ behavior: 'smooth', top: 0 });

  const clear = () => {
    setForm(defaultForm);
    setFiles([]);
    setImage(null);
    scrollTop();
  };

  const clearAlerts = () => {
    setError('');
    setSuccess(false);
  };

  const post = async () => {
    setLoading(true);
    clearAlerts();
    const body: Record<string, unknown> = {
      name: form.name,
      description: form.description,
      tags: form.tags.map((t: ITag) => t.id),
      // creators: form.creators,
      creators: creators.map((c) => parseInt(c)),
      amount: parseInt(form.amount),
    };

    if (form.date.length !== 0) body.date = form.date;

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    let createPatchResult;
    try {
      createPatchResult = await http.post(
        url('/api/patches/create'),
        body,
        config
      );

      const imageFormData = new FormData();
      imageFormData.append('image', image as File);

      const uploadImageResult = await http.post<{
        body: { Location: string }[];
      }>(url('/api/files/upload/image?path=patches'), imageFormData, config);

      await http.post(
        url('/api/files/attach/img-to'),
        {
          id: createPatchResult.data.body.id,
          images: uploadImageResult.data.body.map((b) => b.Location),
          type: 'patch',
        },
        config
      );
    } catch (err) {
      scrollTop();
      setLoading(false);
      setError(String(err));
      return;
    }

    if (files.length !== 0) {
      try {
        await uploadFiles(
          createPatchResult.data.body.id,
          files[0],
          'patch-files',
          'patch'
        );
      } catch {
        scrollTop();
        setLoading(false);
        setSuccess(true);
        setError('Misslyckades att ladda upp bifogade filer.');
        clear();
        return;
      }
    }

    setLoading(false);
    setSuccess(true);
    clear();
  };

  const valid = form.name.length !== 0 && image !== null;

  const patchPreview = useMemo(() => {
    if (image !== null) {
      return URL.createObjectURL(image);
    }
    return '';
  }, [image]);

  return (
    <>
      {/* <Header title="Skapa märke" /> */}
      <StyledPatchCreator>
        {loading && <SpinnerCover />}
        <Content>
          {success && <Alert type="success">Märket skapades</Alert>}
          {error && <Alert type="error">{error}</Alert>}
          <p>Skapa ett märke till märkesarkivet</p>
          <H3>
            Bild <Required />
          </H3>
          <H4>
            Ladda upp en högupplöst bild på märket. En komprimerad version
            genereras av servern och visas som tumnagel i arkivet. Inte förrän
            man klickar på märket syns den högupplösta versionen
          </H4>
          {image && (
            <Row>
              <ImagePreview src={patchPreview} draggable={false} />
            </Row>
          )}
          <FileUploader
            label="Ladda upp en bild på märket"
            files={image ? [image] : []}
            onAddFile={onAddImage}
            onFileRemove={onClearImage}
            accept={['png', 'jpg']}
            disabled={loading}
          />
          <H3>
            Namn <Required />
          </H3>
          <H4>Ange ett namn på märket</H4>
          <Field
            name="name"
            placeholder="Namn"
            value={form.name}
            onChange={onChange}
            disabled={loading}
          />
          <H3>Beskrivning</H3>
          <H4>Beskriv märkets bakgrund, historia eller något annat roligt</H4>
          <TextArea
            name="description"
            placeholder="Beskrivning"
            value={form.description}
            onChange={onChange}
            disabled={loading}
          />
          <H3>Datum</H3>
          <H4>Datum som märket släpptes, lämna tomt om okänt</H4>
          <Field
            name="date"
            type="date"
            value={form.date}
            onChange={onChange}
            disabled={loading}
          />
          <H3>Taggar</H3>
          <H4>Lägg till taggar för enklare filtrering och sökning</H4>
          <TagSelector
            tags={allTags}
            selectedTags={form.tags}
            setSelectedTags={(next: ITag[]) => setForm({ ...form, tags: next })}
            disabled={loading}
            query=""
          />
          <H3>Filer</H3>
          <H4>
            Lägg upp tillhörande filer, exempelvis käll-filer. Endast admin kan
            se dessa filer
          </H4>
          <FileUploader
            files={files}
            onAddFile={(file: File) => setFiles([file])}
            onFileRemove={() => setFiles([])}
            multiple={true}
            label="Går bara att ladda upp en i taget. Lägg upp fler i redigeringsvyn."
          />
          <H3>Upphovsmän</H3>
          <H4>Personer som skapade detta märke</H4>
          <CreatorHandler
            selected={creators}
            setSelected={setCreators}
            data={persons}
            onCreate={async (query: string) => {
              const result = await http.post<{ body: IPerson }>(
                url('/api/persons/person'),
                { name: query }
              );
              setPersons([...persons, result.data.body]);
              return result.data.body;
            }}
            disabled={loading}
          />
          <H3>Antal i fysiska arkivet</H3>
          <H4>
            Hur många märken innehåller det fysiska arkivet? Sätt 0 om okänt,
            detta kan ändras senare.
          </H4>
          <input
            type="number"
            value={form.amount}
            name="amount"
            onChange={onChange}
            disabled={loading}
            min={0}
          />
          <div style={{ margin: '0 0 20px' }}></div>
          <BRow>
            <Button
              label="Återställ"
              onClick={clear}
              color=""
              backgroundColor=""
              disabled={loading}
            />
            <Button
              label="Skapa"
              onClick={post}
              disabled={loading || !valid}
              isLoading={loading}
            />
          </BRow>
        </Content>
      </StyledPatchCreator>
    </>
  );
};
