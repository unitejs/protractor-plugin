import { promise as wdpromise } from 'selenium-webdriver';

export interface ProtractorBrowser {
    uniteLoadAndWaitForPage(url: string, timeout?: number): wdpromise.Promise<any>;
}
