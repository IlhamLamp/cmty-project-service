package controllers

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv"

	"github.com/IlhamLamp/cmty-project-service/dto"
	"github.com/IlhamLamp/cmty-project-service/helpers"
	"github.com/IlhamLamp/cmty-project-service/models"
	"github.com/IlhamLamp/cmty-project-service/services"
	"github.com/IlhamLamp/cmty-project-service/utils"

	"github.com/gin-gonic/gin"
)

type ProjectController struct {
	service services.ProjectService
}

func NewProjectController(s services.ProjectService) *ProjectController {
	return &ProjectController{s}
}

func (c *ProjectController) Create(ctx *gin.Context) {
	var project models.Project
	if err := ctx.ShouldBindJSON(&project); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err, "Invalid request payload")
		return
	}
	if err := c.service.Create(&project); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to create project")
		return
	}
	utils.Created(ctx, project, "Project created successfully")
}

func (c *ProjectController) GetAll(ctx *gin.Context) {
	var filter dto.CoreFilter
	if err := ctx.ShouldBindQuery(&filter); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err, "Invalid query parameters")
		return
	}

	helpers.SanitizePagination(&filter)

	projects, total, err := c.service.GetAll(filter)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to get all projects")
		return
	}
	meta := helpers.BuildPaginationMeta(total, filter.Page, filter.Limit)
	utils.Success(ctx, projects, "Projects retrieved successfully", meta)
}

func (c *ProjectController) GetByID(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	project, err := c.service.GetByID(uint(id))
	if err != nil {
		utils.Error(ctx, http.StatusNotFound, err, "Project not found")
		return
	}
	utils.Success(ctx, project, "Project retrieved succesfully", nil)
}

func (c *ProjectController) Update(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var project models.Project
	if err := ctx.ShouldBindJSON(&project); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err, "Invalid request payload")
		return
	}
	project.ID = uint(id)
	if err := c.service.Update(&project); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to update project")
		return
	}
	utils.Success(ctx, project, "Project updated successfully", nil)
}

func (c *ProjectController) Delete(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := c.service.Delete(uint(id)); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to delete project")
		return
	}
	ctx.Status(http.StatusNoContent)
	utils.Success(ctx, "No Content", "Projects deleted succesfully", nil)
}

// -+-+-+-+ SEEDER HANDLER +-+-+-+-
func (c *ProjectController) SeedProjects(ctx *gin.Context) {
	file, err := os.ReadFile("database/seeders/01_project.json")
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to read JSON file")
		return
	}

	var projects []models.Project
	if err := json.Unmarshal(file, &projects); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to parse JSON")
		return
	}

	var validProjects []models.Project
	for _, p := range projects {
		if p.Title != "" {
			validProjects = append(validProjects, p)
		}
	}

	if err := c.service.BulkCreate(validProjects); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to seed projects")
		return
	}

	utils.Success(ctx, projects, "Projects seeded succesfully", nil)
}

func (c *ProjectController) CleanProjects(ctx *gin.Context) {
	rowsAffected, err := c.service.Clean()
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err, "Failed to clean projects")
		return
	}

	message := "total rows affected: " + strconv.FormatInt(rowsAffected, 10)
	utils.Success(ctx, nil, "Projects cleaned successfully, "+message, nil)
}
