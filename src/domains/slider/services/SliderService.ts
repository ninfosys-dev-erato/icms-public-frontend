import { SliderRepository } from '../repositories/SliderRepository';
import { 
  SliderResponse, 
  SliderQuery, 
  SliderData,
  TranslatableEntity
} from '../types/slider';

export class SliderService {
  private sliderRepository: SliderRepository;

  constructor() {
    this.sliderRepository = new SliderRepository();
  }

  /**
   * Get complete slider data for display
   */
  async getSliderData(locale: 'ne' | 'en' = 'en'): Promise<SliderData> {
    try {
      const sliders = await this.sliderRepository.getActiveSliders();
      return this.processSliderData(sliders, locale);
    } catch (error) {
      console.error('SliderService: API failed', error);
      throw error;
    }
  }


  /**
   * Get active sliders
   */
  async getActiveSliders(): Promise<SliderResponse[]> {
    try {
      return await this.sliderRepository.getActiveSliders();
    } catch (error) {
      console.error('SliderService: Failed to get active sliders:', error);
      throw new Error('Failed to load active sliders');
    }
  }

  /**
   * Get sliders with query
   */
  async getSliders(query?: SliderQuery): Promise<SliderResponse[]> {
    try {
      return await this.sliderRepository.getSliders(query);
    } catch (error) {
      console.error('SliderService: Failed to get sliders:', error);
      throw new Error('Failed to load sliders');
    }
  }

  /**
   * Get slider by ID
   */
  async getSliderById(id: string): Promise<SliderResponse> {
    try {
      return await this.sliderRepository.getSliderById(id);
    } catch (error) {
      console.error('SliderService: Failed to get slider by ID:', error);
      throw new Error('Failed to load slider');
    }
  }

  /**
   * Get sliders by position
   */
  async getSlidersByPosition(position: number): Promise<SliderResponse[]> {
    try {
      return await this.sliderRepository.getSlidersByPosition(position);
    } catch (error) {
      console.error('SliderService: Failed to get sliders by position:', error);
      throw new Error('Failed to load sliders by position');
    }
  }

  /**
   * Process and validate slider data
   */
  private processSliderData(sliders: SliderResponse[], locale: 'ne' | 'en'): SliderData {
    console.log('SliderService: Processing slider data:', sliders);
    console.log('SliderService: Raw slider count:', sliders.length);
    
    const validSliders = sliders
      .filter(slider => this.isSliderValid(slider))
      .sort((a, b) => a.position - b.position);
    
    console.log('SliderService: Valid sliders after filtering:', validSliders);
    console.log('SliderService: Valid slider count:', validSliders.length);
    
    const result = {
      sliders: validSliders,
      currentIndex: 0,
      isPlaying: true,
      isTransitioning: false
    };
    
    console.log('SliderService: Final processed data:', result);
    
    return result;
  }

  /**
   * Check if slider is valid
   */
  private isSliderValid(slider: SliderResponse): boolean {
    const isValid = Boolean(
      slider.id &&
      slider.isActive &&
      slider.media &&
      slider.media.presignedUrl &&
      slider.media.presignedUrl.trim() !== ''
    );
    
    if (!isValid) {
      console.log('SliderService: Invalid slider filtered out:', {
        id: slider.id,
        isActive: slider.isActive,
        hasMedia: !!slider.media,
        hasPresignedUrl: !!slider.media?.presignedUrl,
        presignedUrl: slider.media?.presignedUrl,
        mediaObject: slider.media
      });
    } else {
      console.log('SliderService: Valid slider:', {
        id: slider.id,
        title: slider.title,
        position: slider.position,
        presignedUrl: slider.media?.presignedUrl
      });
    }
    
    return isValid;
  }

  /**
   * Get localized text from translatable entity
   */
  getLocalizedText(entity: TranslatableEntity, locale: 'ne' | 'en'): string {
    return entity[locale] || entity.en || entity.ne || '';
  }

  /**
   * Track slider click
   */
  async trackSliderClick(sliderId: string): Promise<void> {
    try {
      await this.sliderRepository.trackSliderClick(sliderId);
    } catch (error) {
      console.warn('SliderService: Failed to track slider click:', error);
      // Don't throw error for analytics tracking
    }
  }

  /**
   * Track slider view
   */
  async trackSliderView(sliderId: string): Promise<void> {
    try {
      await this.sliderRepository.trackSliderView(sliderId);
    } catch (error) {
      console.warn('SliderService: Failed to track slider view:', error);
      // Don't throw error for analytics tracking
    }
  }

  /**
   * Get next slider index
   */
  getNextIndex(currentIndex: number, totalSliders: number): number {
    if (totalSliders === 0) return 0;
    return (currentIndex + 1) % totalSliders;
  }

  /**
   * Get previous slider index
   */
  getPreviousIndex(currentIndex: number, totalSliders: number): number {
    if (totalSliders === 0) return 0;
    return currentIndex === 0 ? totalSliders - 1 : currentIndex - 1;
  }

  /**
   * Check if slider should auto-advance
   */
  shouldAutoAdvance(slider: SliderResponse): boolean {
    return slider.displayTime > 0;
  }

  /**
   * Get display time for slider
   */
  getDisplayTime(slider: SliderResponse): number {
    return Math.max(slider.displayTime, 3000); // Minimum 3 seconds
  }
}

// Export singleton instance for easier importing
export const sliderService = new SliderService();
