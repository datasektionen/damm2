import React, { useEffect, useRef, useState } from 'react';
import { StyledTagManager, Content } from './style';
import http from '../../common/api';
import { url } from '../../common/api';
import { ITag } from '../../types/definitions';
import { TagEditor, ITagEdit } from '../../components/TagEditor/TagEditor';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import { Alert } from '../../components/Alert/Alert';
import { useTitle } from '../../hooks/useTitle';
import { title } from '../../common/strings';

const defaultFormValue: ITagEdit = {
  name: '',
  description: '',
  color: '',
  backgroundColor: '',
  type: 'PATCH',
  category: 'RECEPTION',
};

export const TagsManager: React.FC = () => {
  useTitle(title('Hantera taggar'));

  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [form, setForm] = useState<ITagEdit>(defaultFormValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestError, setRequestError] = useState('');
  const [success, setSuccess] = useState<string>('');
  const ref = useRef(document.createElement('div'));

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const fetchTags = async () => {
    const result = await http.get<{ body: ITag[] }>(url('/api/tags/all'));
    if (result.status === 200) {
      setTags(result.data.body);
      setLoading(false);
      setSelectedTag(null);
      setForm(defaultFormValue);
    }
    // TODO: Handle error
  };

  useEffect(() => {
    (async () => {
      await fetchTags();
    })();
  }, []);

  const clickTag = (t: ITag | null) => {
    setSelectedTag(t);
    setForm(t ?? defaultFormValue);
  };

  const submit = async () => {
    setLoading(true);
    setRequestError('');
    setSuccess('');

    // Update
    if (form.id) {
      http
        .put(url('/api/tags/update'), form, authConfig)
        .then(async () => {
          await fetchTags();
          setSuccess('Taggen sparades');
        })
        .catch((err) => {
          setRequestError(JSON.stringify(err.response.data));
        })
        .finally(() => {
          ref?.current?.scrollIntoView();
          setLoading(false);
        });
    } else {
      // Create new
      http
        .post(url('/api/tags/create'), form, authConfig)
        .then(async () => {
          await fetchTags();
          setSuccess('Taggen sparades');
        })
        .catch((err) => {
          setRequestError(JSON.stringify(err.response.data));
        })
        .finally(() => {
          ref?.current?.scrollIntoView();
          setLoading(false);
        });
    }
  };

  const deleteTag = async () => {
    setLoading(true);
    http
      .delete(url(`/api/tags/${form.id}`), authConfig)
      .then(async () => {
        setLoading(false);
        setSuccess('Taggen togs bort');
        await fetchTags();
        ref?.current?.scrollIntoView();
      })
      .catch(() => {});
  };

  return (
    <div ref={ref}>
      <StyledTagManager>
        {loading && <SpinnerCover />}
        <Content>
          {requestError && <Alert type="error">{requestError}</Alert>}
          {success && <Alert type="success">{success}</Alert>}
          <TagEditor
            tags={tags}
            selectedTag={selectedTag}
            setSelectedTag={clickTag}
            value={form}
            setValue={(next: ITagEdit) => setForm(next)}
            onSubmit={submit}
            onDelete={deleteTag}
            loading={loading}
          />
        </Content>
      </StyledTagManager>
    </div>
  );
};
