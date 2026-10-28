/*
 * The editors' chunk (idea 4). Nothing here loads with a dashboard: the card's
 * getConfigElement() imports this module the first time an editor is opened, which is when
 * Home Assistant calls it, so the two editors, the health panel and everything only they use
 * - the shared store, the library, the diff, the search, the undo - stay out of the file every
 * page downloads. Importing it defines the three elements; importing it twice is harmless.
 */
import { DeclutteringCardEditor } from './card-editor';
import { DeclutteringTemplateEditor } from './template-editor';
import { DeclutteringHealthPanel } from './health-panel';
import { CARD_EDITOR_TAG, HEALTH_TAG, TEMPLATE_EDITOR_TAG, defineElement } from './shared';

defineElement(CARD_EDITOR_TAG, DeclutteringCardEditor);

defineElement(TEMPLATE_EDITOR_TAG, DeclutteringTemplateEditor);

defineElement(HEALTH_TAG, DeclutteringHealthPanel);

export { DeclutteringCardEditor, DeclutteringTemplateEditor, DeclutteringHealthPanel };
