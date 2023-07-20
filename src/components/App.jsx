import { useState, useEffect } from 'react';
import { requestGetImages } from 'services/api';
import { Section } from './Section/Section';
import { ImageGallery } from './ImageGallerys/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
// import { Button } from './Button/Button';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { useInView } from 'react-intersection-observer';

export function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, modalData: null });

    const { ref, inView } = useInView({
        rootMargin: '200px',
    });

    useEffect(() => {
        async function getImages() {
            setIsLoading(true);

            try {
                const resp = await requestGetImages(searchTerm, currentPage);
                if (!resp.hits.length) {
                    Notify.warning('No images found');
                    return;
                }
                if (currentPage === 1) {
                    setImages(resp.hits);
                    setTotalPages(Math.ceil(resp.totalHits / 12));
                    window.scrollTo(0, 0);
                } else {
                    setImages(prevState => [...prevState, ...resp.hits]);
                    scroll();
                }
            } catch (error) {
                Notify.failure(`Someting wrong!</br><b>${error.message}</b>`, {
                    plainText: false,
                });
            } finally {
                setIsLoading(false);
            }
        }

        function scroll() {
            setTimeout(() => {
                window.scrollBy({
                    top: window.innerHeight / 1.5,
                    behavior: 'smooth',
                });
            }, 0);
        }

        if (!!searchTerm) getImages();
    }, [currentPage, searchTerm]);

    useEffect(() => {
        inView && loadMore();
    }, [inView]);

    const onGetNewImages = async e => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchTerm(e.target.search.value);
        e.target.reset();
    };

    const loadMore = () => {
        setCurrentPage(prevState => prevState + 1);
    };

    const openModal = data => {
        setModal({ isOpen: true, modalData: data });
    };

    const closeModal = () => {
        setModal({ isOpen: false, modalData: null });
    };

    return (
        <>
            <Searchbar onGetNewImages={onGetNewImages} />
            {isLoading && <Loader />}
            {!!images.length && (
                <Section>
                    <ImageGallery images={images} onModalClick={openModal} />
                    {modal.isOpen && (
                        <Modal
                            modalData={modal.modalData}
                            onClose={closeModal}
                        />
                    )}
                    {/* {totalPages > 1 && currentPage < totalPages && (
                        <Button onClick={loadMore}>Load more</Button>
                    )} */}
                    {totalPages > 1 && currentPage < totalPages && (
                        <div ref={ref}></div>
                    )}
                </Section>
            )}
        </>
    );
}
