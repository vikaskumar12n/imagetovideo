import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `http://localhost:5000/api/videos/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error generating video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        padding: '20px',
      }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-12">
          <div className="card shadow rounded-4 border-0 mx-auto" style={{ maxWidth: '1200px' }}>
            <div className="card-body p-4">
              <h2 className="card-title mb-4 text-center text-primary">
                Upload an Image to Generate a Video
              </h2>

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="imageInput" className="form-label">
                    Select Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageInput"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Generating...
                      </>
                    ) : (
                      'Generate Video'
                    )}
                  </button>
                </div>
              </form>

              {videoUrl && (
                <div className="mt-4">
                  <h5 className="text-success">Generated Video:</h5>
                  <video
                    src={videoUrl}
                    controls
                    className="w-100 rounded shadow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
