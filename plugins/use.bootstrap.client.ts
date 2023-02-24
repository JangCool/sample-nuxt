import {
    Alert,
    Button,
    Dropdown,
    Modal,
    Popover,
    Tooltip,
    ScrollSpy,
    Carousel,
    Collapse,
    Offcanvas,
    Tab
} from 'bootstrap';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('bootstrap', {
        Alert,
        Button,
        Dropdown,
        Modal,
        Popover,
        Tooltip,
        ScrollSpy,
        Carousel,
        Collapse,
        Offcanvas,
        Tab
    });
});