import { t } from "i18next";
import Swal from "sweetalert2";
import { Store } from "./Store";

export class ModalStore {
    constructor(private store: Store) {

    }

    ShowErrorMessage(message: string) {
        Swal.fire({
            title: t('Lỗi'),
            text: t(message),
            icon: 'error',
            confirmButtonText: t("Xác nhận")
        });
    }

    ShowSuccessMessage(message: string) {
        Swal.fire({
            title: t('Thành công'),
            text: t(message),
            icon: 'success',
            confirmButtonText: t("Xác nhận")
        });
    }
}