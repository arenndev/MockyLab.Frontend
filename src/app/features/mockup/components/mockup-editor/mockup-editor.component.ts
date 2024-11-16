import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MockupService } from '../../../../core/services/mockup.service';
import { GenderCategory, DesignColor } from '../../../../core/models/enums';
import { MockupRequest, MockupResponse } from '../../../../core/models/mockup.model';
import { environment } from '../../../../../environments/environment.development';

declare const fabric: any;

interface FabricObject {
  left?: number;
  top?: number;
  angle?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  selectable?: boolean;
  visible?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  lockRotation?: boolean;
  lockScalingX?: boolean;
  lockScalingY?: boolean;
  fill?: string;
  moveTo?(index: number): void;
  center?(): void;
  getScaledWidth?(): number;
  getScaledHeight?(): number;
  getCenterPoint?(): { x: number; y: number };
  set?(key: string, value: any): void;
  scaleToWidth?(width: number): void;
  scaleToHeight?(height: number): void;
}

interface FabricImage extends FabricObject {
  scaleToWidth(width: number): void;
  scaleToHeight(height: number): void;
}

@Component({
  selector: 'app-mockup-editor',
  templateUrl: './mockup-editor.component.html',
  styleUrls: ['./mockup-editor.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MockupEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  
  canvas?: any;
  form!: FormGroup;
  mockupId?: number;
  designArea?: FabricObject;
  backgroundImage?: FabricObject;
  
  genderCategories = Object.values(GenderCategory);
  designColors = Object.values(DesignColor);

  constructor(
    private fb: FormBuilder,
    private mockupService: MockupService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mockupId = +params['id'];
        this.loadMockup();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    if (this.canvas) {
      this.canvas.dispose();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['T-Shirt', Validators.required],
      genderCategory: [GenderCategory.Unisex, Validators.required],
      designColor: [DesignColor.Black, Validators.required],
      imageFile: [null]
    });
  }

  private initCanvas(): void {
    this.canvas = new fabric.Canvas(this.canvasEl.nativeElement, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0'
    });

    const rect = new fabric.Rect({
      width: 200,
      height: 200,
      fill: 'rgba(0,0,0,0.3)',
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      visible: false,
      selectable: true
    });

    this.designArea = rect;
    this.canvas.add(rect);
    this.canvas.renderAll();

    this.canvas.on('object:modified', (e: any) => {
      if (e.target) {
        this.onDesignAreaModified(e);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          fabric.Image.fromURL(e.target.result, (img: FabricImage) => {
            if (this.canvas) {
              if (this.backgroundImage) {
                this.canvas.remove(this.backgroundImage);
              }

              const canvasWidth = this.canvas.width || 800;
              const canvasHeight = this.canvas.height || 600;

              img.scaleToWidth(canvasWidth);
              if ((img.height || 0) * (img.scaleY || 1) > canvasHeight) {
                img.scaleToHeight(canvasHeight);
              }

              img.center?.();
              img.selectable = false;

              this.backgroundImage = img;
              this.canvas.add(img);
              img.moveTo?.(0);

              if (this.designArea) {
                this.designArea.set?.('visible', true);
                this.designArea.center?.();
                this.canvas.setActiveObject(this.designArea);
              }

              this.canvas.renderAll();
            }
          });
        }
      };

      reader.readAsDataURL(file);
      this.form.patchValue({ imageFile: file });
    }
  }

  private onDesignAreaModified(e: any): void {
    if (e.target === this.designArea) {
      const rect = e.target as FabricObject;
      const center = rect.getCenterPoint?.();
      console.log({
        left: rect.left,
        top: rect.top,
        width: rect.getScaledWidth?.(),
        height: rect.getScaledHeight?.(),
        angle: rect.angle,
        centerX: center?.x,
        centerY: center?.y
      });
    }
  }

  private loadMockup(): void {
    if (this.mockupId) {
      this.mockupService.getMockupById(this.mockupId).subscribe(
        (mockup: MockupResponse) => {
          this.updateForm(mockup);
          this.loadBackgroundImage(mockup.backgroundImagePath);
        }
      );
    }
  }

  private updateForm(mockup: MockupResponse): void {
    this.form.patchValue({
      name: mockup.name,
      category: mockup.category,
      genderCategory: mockup.genderCategory,
      designColor: mockup.designColor
    });
  }

  private loadBackgroundImage(path: string): void {
    fabric.Image.fromURL(`${environment.apiUrl}/${path}`, (img: FabricImage) => {
      if (this.canvas) {
        if (this.backgroundImage) {
          this.canvas.remove(this.backgroundImage);
        }

        const canvasWidth = this.canvas.width || 800;
        const canvasHeight = this.canvas.height || 600;

        img.scaleToWidth(canvasWidth);
        if ((img.height || 0) * (img.scaleY || 1) > canvasHeight) {
          img.scaleToHeight(canvasHeight);
        }

        img.center?.();
        img.selectable = false;

        this.backgroundImage = img;
        this.canvas.add(img);
        img.moveTo?.(0);

        if (this.designArea) {
          this.designArea.set?.('visible', true);
          this.designArea.center?.();
          this.canvas.setActiveObject(this.designArea);
        }

        this.canvas.renderAll();
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.designArea) {
      const formData = this.form.value;
      const center = this.designArea.getCenterPoint?.();
      const request: MockupRequest = {
        ...formData,
        left: this.designArea.left ?? 0,
        top: this.designArea.top ?? 0,
        centerX: center?.x ?? 0,
        centerY: center?.y ?? 0,
        width: this.designArea.getScaledWidth?.() ?? 200,
        height: this.designArea.getScaledHeight?.() ?? 200,
        angle: this.designArea.angle ?? 0
      };

      if (this.mockupId) {
        this.mockupService.updateMockup(this.mockupId, request).subscribe(
          () => this.router.navigate(['/mockups'])
        );
      } else {
        this.mockupService.createMockup(request).subscribe(
          () => this.router.navigate(['/mockups'])
        );
      }
    }
  }
}